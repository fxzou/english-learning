const ttsEndpoint = "https://tts-voice-magic-2.fxzouv.workers.dev/v1/audio/speech";
const maxItems = 80;
const concurrency = 4;

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || "{}");
}

function normalizeItem(item) {
  return {
    input: String(item.input || item.text || "").slice(0, 3000),
    voice: String(item.voice || "en-US-JennyNeural"),
    speed: Number(item.speed || 1.0),
    pitch: String(item.pitch ?? "0"),
    style: String(item.style || "general"),
  };
}

async function requestSpeechBuffer(item) {
  const response = await fetch(ttsEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(`TTS request failed: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function runQueue(items) {
  const buffers = Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      buffers[index] = await requestSpeechBuffer(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return buffers;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const items = (Array.isArray(body.items) ? body.items : [])
      .map(normalizeItem)
      .filter((item) => item.input.trim())
      .slice(0, maxItems);

    if (items.length === 0) {
      res.status(400).json({ error: "Missing audio items" });
      return;
    }

    const buffers = await runQueue(items);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(Buffer.concat(buffers));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
