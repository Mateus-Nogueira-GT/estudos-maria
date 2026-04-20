import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  TopicsFileSchema,
  QuestionsFileSchema,
  FlashcardsFileSchema,
} from "../lib/schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "..", "data");

type Check = { name: string; file: string; schema: { parse: (v: unknown) => unknown } };

const checks: Check[] = [
  { name: "Topics", file: "topics.json", schema: TopicsFileSchema },
  { name: "Questions", file: "questions.json", schema: QuestionsFileSchema },
  { name: "Flashcards", file: "flashcards.json", schema: FlashcardsFileSchema },
];

let failed = false;
const perTopic = new Map<string, { questions: number; flashcards: number }>();
const topicIds = new Set<string>();

for (const c of checks) {
  const full = path.join(DATA_DIR, c.file);
  try {
    const raw = JSON.parse(fs.readFileSync(full, "utf-8"));
    const parsed = c.schema.parse(raw) as unknown[];
    console.log(`✓ ${c.name.padEnd(10)} ${c.file} — ${parsed.length} registros`);

    if (c.name === "Topics") {
      for (const t of parsed as Array<{ id: string }>) {
        topicIds.add(t.id);
        perTopic.set(t.id, { questions: 0, flashcards: 0 });
      }
    }
    if (c.name === "Questions") {
      for (const q of parsed as Array<{ topicId: string }>) {
        const stat = perTopic.get(q.topicId);
        if (!stat) {
          console.error(`  ✗ Questão referencia topicId inexistente: ${q.topicId}`);
          failed = true;
        } else stat.questions += 1;
      }
    }
    if (c.name === "Flashcards") {
      for (const f of parsed as Array<{ topicId: string }>) {
        const stat = perTopic.get(f.topicId);
        if (!stat) {
          console.error(`  ✗ Flashcard referencia topicId inexistente: ${f.topicId}`);
          failed = true;
        } else stat.flashcards += 1;
      }
    }
  } catch (e) {
    console.error(`✗ ${c.name} falhou:`, e instanceof Error ? e.message : e);
    failed = true;
  }
}

console.log("\nDistribuição por tópico:");
for (const [id, stat] of perTopic) {
  const warn = stat.questions === 0 ? "  ⚠ sem questões" : "";
  console.log(`  ${id.padEnd(32)} Q=${String(stat.questions).padStart(3)}  F=${String(stat.flashcards).padStart(3)}${warn}`);
}

if (failed) {
  console.error("\n✗ Validação falhou");
  process.exit(1);
}
console.log("\n✔ Todos os dados estão válidos");
