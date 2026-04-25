import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "..", "data");

const specs = [
  { label: "questions", blocksDir: path.join(DATA_DIR, "blocks"), outFile: path.join(DATA_DIR, "questions.json") },
  { label: "flashcards", blocksDir: path.join(DATA_DIR, "flashcard-blocks"), outFile: path.join(DATA_DIR, "flashcards.json") },
];

const report = [];
for (const spec of specs) {
  if (!fs.existsSync(spec.blocksDir)) continue;
  const blocks = fs.readdirSync(spec.blocksDir).filter((f) => f.endsWith(".json")).sort();
  const merged = [];
  const per = [];
  for (const f of blocks) {
    const parsed = JSON.parse(fs.readFileSync(path.join(spec.blocksDir, f), "utf-8"));
    if (!Array.isArray(parsed)) throw new Error(`Block ${f} not array`);
    merged.push(...parsed);
    per.push(`${f}=${parsed.length}`);
  }
  fs.writeFileSync(spec.outFile, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  report.push(`${spec.label}: ${merged.length} total (${per.join(", ")})`);
}
fs.writeFileSync(path.join(DATA_DIR, ".build-report.txt"), report.join("\n") + "\n");
process.stdout.write(report.join("\n") + "\n");
process.exit(0);
