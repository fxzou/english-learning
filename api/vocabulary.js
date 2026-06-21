import { readFile } from "node:fs/promises";
import path from "node:path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const indexPath = path.join(process.cwd(), "lessons", "vocabulary-index.json");
    const vocabularyIndex = JSON.parse(await readFile(indexPath, "utf8"));
    res.status(200).json(vocabularyIndex);
  } catch {
    res.status(200).json({
      lessonCount: 0,
      wordCount: 0,
      days: [],
      words: [],
      wordList: [],
      wordsText: "",
      duplicates: [],
    });
  }
}
