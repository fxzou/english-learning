import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

test("lesson file exists and has exercises", async () => {
  const lesson = JSON.parse(await readFile(new URL("../lessons/day-01.json", import.meta.url), "utf8"));
  assert.equal(lesson.day, 1);
  assert.ok(Array.isArray(lesson.exercises));
  assert.ok(lesson.exercises.length > 0);
});
