import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "..", "data");

type BuildSpec = {
  label: string;
  blocksDir: string;
  outFile: string;
};

const specs: BuildSpec[] = [
  {
    label: "questions",
    blocksDir: path.join(DATA_DIR, "blocks"),
    outFile: path.join(DATA_DIR, "questions.json"),
  },
  {
    label: "flashcards",
    blocksDir: path.join(DATA_DIR, "flashcard-blocks"),
    outFile: path.join(DATA_DIR, "flashcards.json"),
  },
];

for (const spec of specs) {
  console.log(`\nBuilding ${spec.label}...`);
  if (!fs.existsSync(spec.blocksDir)) {
    console.log(`  (skip — ${spec.blocksDir} does not exist)`);
    continue;
  }
  const blocks = fs
    .readdirSync(spec.blocksDir)
    .filter((f) => f.endsWith(".json"))
    .sort();
  const merged: unknown[] = [];
  for (const f of blocks) {
    const full = path.join(spec.blocksDir, f);
    const parsed = JSON.parse(fs.readFileSync(full, "utf-8"));
    if (!Array.isArray(parsed)) {
      throw new Error(`Block ${f} in ${spec.blocksDir} is not a JSON array`);
    }
    merged.push(...parsed);
    console.log(`  + ${f} (${parsed.length})`);
  }
  fs.writeFileSync(spec.outFile, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  console.log(`✔ ${merged.length} ${spec.label} → ${path.relative(process.cwd(), spec.outFile)}`);
}
