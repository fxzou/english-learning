const ttsEndpoint = "https://tts-voice-magic-2.fxzouv.workers.dev/v1/audio/speech";

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || "{}");
}

function normalizePayload(body) {
  return {
    input: String(body.input || "").slice(0, 5000),
    voice: String(body.voice || "en-US-JennyNeural"),
    speed: Number(body.speed || 1.0),
    pitch: String(body.pitch ?? "0"),
    style: String(body.style || "general"),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const payload = normalizePayload(await readJsonBody(req));
    if (!payload.input.trim()) {
      res.status(400).json({ error: "Missing input" });
      return;
    }

    const response = await fetch(ttsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      res.status(response.status).json({ error: `TTS request failed: ${response.status}` });
      return;
    }

    const audio = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", response.headers.get("content-type") || "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(audio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
