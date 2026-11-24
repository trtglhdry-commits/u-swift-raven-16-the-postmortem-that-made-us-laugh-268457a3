// The Postmortem That Made Us Laugh — make.fun entry
//
// Writes one short account (two sentences, <= 400 characters) of the
// silliest time an AI coding agent misunderstood what it was asked and
// wrecked the code it was given, to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output/entry.txt).
//
// The gate: UTF-8 text of 1 to 400 characters, not only whitespace.
// This program enforces the same gate itself before writing, so an
// invalid entry can never be produced.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I asked the agent to rename one variable, `userId` to `accountId`, " +
  "and it renamed it everywhere \u2014 the migration, the seed data, and " +
  "the string inside the error message that still said 'userId not found'. " +
  "The deploy went green, and the postmortem took three hours and one " +
  "very quiet Slack thread.";

const MAX_CHARS = 400;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const chars = [...ENTRY].length;
if (chars < 1 || chars > MAX_CHARS) {
  fail(`entry is ${chars} characters, outside the 1-${MAX_CHARS} gate`);
}
if (ENTRY.trim().length === 0) {
  fail("entry is only whitespace");
}
const sentences = ENTRY.split(/[.!?]+/).filter((s) => s.trim().length > 0);
if (sentences.length < 1 || sentences.length > 2) {
  fail(`entry has ${sentences.length} sentences, gate allows 1-2`);
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be a single block of text, no embedded newlines");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");
console.log(`wrote ${chars} characters to ${outPath}`);
