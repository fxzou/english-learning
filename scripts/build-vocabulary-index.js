import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const lessonsDir = path.join(process.cwd(), "lessons");
const outputPath = path.join(lessonsDir, "vocabulary-index.json");

function normalizeWord(word) {
  return String(word || "").trim().toLowerCase();
}

async function readLesson(fileName) {
  const raw = await readFile(path.join(lessonsDir, fileName), "utf8");
  return JSON.parse(raw);
}

async function buildVocabularyIndex() {
  const lessonFiles = (await readdir(lessonsDir))
    .filter((fileName) => /^day-\d+\.json$/.test(fileName))
    .sort();

  const seen = new Map();
  const days = [];
  const words = [];
  const duplicates = [];
  const wordList = [];

  for (const fileName of lessonFiles) {
    const lesson = await readLesson(fileName);
    const dayWords = (lesson.vocabulary || []).map((item) => {
      const entry = {
        day: lesson.day,
        file: fileName,
        title: lesson.title,
        word: item.word,
        meaning: item.meaning,
      };
      const key = normalizeWord(item.word);
      if (seen.has(key)) {
        duplicates.push({ word: item.word, first: seen.get(key), duplicate: entry });
      } else {
        seen.set(key, entry);
      }
      words.push(entry);
      wordList.push(item.word);
      return item.word;
    });

    days.push({
      day: lesson.day,
      file: fileName,
      title: lesson.title,
      words: dayWords,
    });
  }

  return {
    lessonCount: lessonFiles.length,
    wordCount: words.length,
    days,
    words,
    wordList,
    wordsText: wordList.join("\n"),
    duplicates,
  };
}

const index = await buildVocabularyIndex();
await writeFile(outputPath, JSON.stringify(index, null, 2) + "\n", "utf8");

if (index.duplicates.length > 0) {
  console.error(`Found ${index.duplicates.length} duplicate vocabulary word(s).`);
  for (const item of index.duplicates) {
    console.error(`- ${item.word}: ${item.first.file} and ${item.duplicate.file}`);
  }
  process.exit(1);
}

console.log(`Vocabulary index written: ${outputPath}`);
console.log(`Lessons: ${index.lessonCount}, words: ${index.wordCount}`);
