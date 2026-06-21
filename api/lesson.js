import { readFile } from "node:fs/promises";
import path from "node:path";

function sanitizeDayId(dayId) {
  const safe = String(dayId || "").trim();
  if (!/^\d{1,3}$/.test(safe)) return null;
  return safe.padStart(2, "0");
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const safeDay = sanitizeDayId(req.query.day || "1");
  if (!safeDay) {
    res.status(400).json({ error: "Invalid day" });
    return;
  }

  try {
    const lessonPath = path.join(process.cwd(), "lessons", `day-${safeDay}.json`);
    const lesson = JSON.parse(await readFile(lessonPath, "utf8"));
    res.status(200).json({ lesson, progress: { completed: {}, answers: {} } });
  } catch {
    res.status(404).json({ error: "Lesson not found" });
  }
}
