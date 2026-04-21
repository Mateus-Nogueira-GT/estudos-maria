// Anki-style cloze parser.
//
// Marker syntax: {{c1::answer}} or {{c1::answer::hint}}
// Multiple markers (c1, c2, ...) may appear in the same card; in this
// simplified single-side reveal model, all of them are hidden on the front
// and revealed on the back.

export type ClozeSegment =
  | { kind: "text"; text: string }
  | { kind: "cloze"; group: number; answer: string; hint?: string };

const CLOZE_RE = /\{\{c(\d+)::([^}]+?)(?:::([^}]+?))?\}\}/g;

export function parseCloze(input: string): ClozeSegment[] {
  const out: ClozeSegment[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  CLOZE_RE.lastIndex = 0;
  while ((m = CLOZE_RE.exec(input)) !== null) {
    if (m.index > lastIndex) {
      out.push({ kind: "text", text: input.slice(lastIndex, m.index) });
    }
    out.push({
      kind: "cloze",
      group: parseInt(m[1], 10),
      answer: m[2],
      hint: m[3],
    });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < input.length) {
    out.push({ kind: "text", text: input.slice(lastIndex) });
  }
  return out;
}

/** Returns the count of cloze markers in the text. */
export function countClozes(input: string): number {
  return (input.match(CLOZE_RE) || []).length;
}
