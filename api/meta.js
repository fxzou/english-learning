import os from "node:os";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.status(200).json({
    days: 30,
    progress: { completed: {}, answers: {} },
    host: os.hostname(),
  });
}
