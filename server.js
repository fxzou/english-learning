import http from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const lessonsDir = path.join(rootDir, "lessons");
const dataDir = path.join(rootDir, "data");
const progressPath = path.join(dataDir, "progress.json");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

async function readJson(filePath, fallback) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function send(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(body);
}

function sanitizeDayId(dayId) {
  const safe = String(dayId || "").trim();
  if (!/^\d{1,3}$/.test(safe)) return null;
  return safe.padStart(2, "0");
}

async function loadLesson(dayId) {
  const safeDay = sanitizeDayId(dayId);
  if (!safeDay) return null;
  const lessonPath = path.join(lessonsDir, `day-${safeDay}.json`);
  try {
    return JSON.parse(await readFile(lessonPath, "utf8"));
  } catch {
    return null;
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(publicDir, pathname));
  if (!filePath.startsWith(publicDir)) {
    send(res, 403, "Forbidden");
    return;
  }
  try {
    const file = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, file, mimeTypes[ext] || "application/octet-stream");
  } catch {
    send(res, 404, "Not Found");
  }
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/lesson") {
    const day = url.searchParams.get("day") || "1";
    const lesson = await loadLesson(day);
    if (!lesson) {
      send(res, 404, JSON.stringify({ error: "Lesson not found" }), "application/json; charset=utf-8");
      return;
    }
    const progress = await readJson(progressPath, { completed: {}, answers: {} });
    send(
      res,
      200,
      JSON.stringify({ lesson, progress }, null, 2),
      "application/json; charset=utf-8"
    );
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/progress") {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw || "{}");
    const progress = await readJson(progressPath, { completed: {}, answers: {} });
    if (body.day) {
      progress.completed[String(body.day)] = {
        completedAt: new Date().toISOString(),
        score: Number(body.score || 0),
        total: Number(body.total || 0),
      };
    }
    if (body.answers) {
      progress.answers[String(body.day || "1")] = body.answers;
    }
    await writeJson(progressPath, progress);
    send(res, 200, JSON.stringify({ ok: true }), "application/json; charset=utf-8");
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/meta") {
    const progress = await readJson(progressPath, { completed: {}, answers: {} });
    send(
      res,
      200,
      JSON.stringify(
        {
          days: 30,
          progress,
          host: os.hostname(),
        },
        null,
        2
      ),
      "application/json; charset=utf-8"
    );
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/vocabulary") {
    const vocabularyIndex = await readJson(path.join(lessonsDir, "vocabulary-index.json"), {
      lessonCount: 0,
      wordCount: 0,
      days: [],
      words: [],
      duplicates: [],
    });
    send(res, 200, JSON.stringify(vocabularyIndex, null, 2), "application/json; charset=utf-8");
    return;
  }

  send(res, 404, JSON.stringify({ error: "Not found" }), "application/json; charset=utf-8");
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    await serveStatic(req, res);
  } catch (error) {
    send(res, 500, `Internal Server Error: ${error.message}`);
  }
});

const port = Number(process.env.PORT || 8000);
const host = process.env.HOST || "0.0.0.0";
server.listen(port, host, () => {
  console.log(`Learning web app running at http://${host}:${port}`);
});
