import { describe, it, expect } from "vitest";
import { parseCloze, countClozes } from "./cloze";

describe("parseCloze", () => {
  it("returns plain text when no markers", () => {
    expect(parseCloze("hello world")).toEqual([
      { kind: "text", text: "hello world" },
    ]);
  });

  it("parses a single cloze", () => {
    expect(parseCloze("a {{c1::b}} c")).toEqual([
      { kind: "text", text: "a " },
      { kind: "cloze", group: 1, answer: "b" },
      { kind: "text", text: " c" },
    ]);
  });

  it("parses multiple clozes with different groups", () => {
    const segs = parseCloze("the {{c1::heart}} pumps {{c2::blood}}");
    expect(segs).toHaveLength(4);
    expect(segs[1]).toEqual({ kind: "cloze", group: 1, answer: "heart" });
    expect(segs[3]).toEqual({ kind: "cloze", group: 2, answer: "blood" });
  });

  it("parses cloze with hint", () => {
    expect(parseCloze("{{c1::aorta::vaso}}")).toEqual([
      { kind: "cloze", group: 1, answer: "aorta", hint: "vaso" },
    ]);
  });

  it("returns empty when input is empty", () => {
    expect(parseCloze("")).toEqual([]);
  });
});

describe("countClozes", () => {
  it("returns 0 for plain text", () => {
    expect(countClozes("nothing here")).toBe(0);
  });
  it("counts multiple markers", () => {
    expect(countClozes("{{c1::a}} and {{c2::b}} and {{c1::c}}")).toBe(3);
  });
});
