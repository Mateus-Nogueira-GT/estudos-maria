import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOCKS_DIR = path.resolve(__dirname, "..", "data", "blocks");
const OUT_FILE = path.resolve(__dirname, "..", "data", "questions.json");

const blocks = fs
  .readdirSync(BLOCKS_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

const merged: unknown[] = [];
for (const f of blocks) {
  const full = path.join(BLOCKS_DIR, f);
  const parsed = JSON.parse(fs.readFileSync(full, "utf-8"));
  if (!Array.isArray(parsed)) {
    throw new Error(`Block ${f} is not a JSON array`);
  }
  merged.push(...parsed);
  console.log(`  + ${f} (${parsed.length})`);
}

fs.writeFileSync(OUT_FILE, JSON.stringify(merged, null, 2) + "\n", "utf-8");
console.log(`\n✔ Wrote ${merged.length} questions to ${path.relative(process.cwd(), OUT_FILE)}`);
