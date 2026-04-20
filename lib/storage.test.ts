import { describe, it, expect, beforeEach } from "vitest";
import {
  EMPTY_STATE,
  loadState,
  saveState,
  resetState,
  recordAnswer,
  __STORAGE_KEY,
} from "./storage";

class MemoryStorage {
  private data: Record<string, string> = {};
  getItem(k: string) { return this.data[k] ?? null; }
  setItem(k: string, v: string) { this.data[k] = v; }
  removeItem(k: string) { delete this.data[k]; }
  clear() { this.data = {}; }
}

beforeEach(() => {
  // @ts-expect-error attach memory storage to globalThis
  globalThis.window = { localStorage: new MemoryStorage() };
});

describe("loadState", () => {
  it("returns EMPTY_STATE when nothing stored", () => {
    expect(loadState()).toEqual(EMPTY_STATE);
  });
  it("returns EMPTY_STATE when invalid JSON", () => {
    (globalThis as any).window.localStorage.setItem(__STORAGE_KEY, "{{{not json");
    expect(loadState()).toEqual(EMPTY_STATE);
  });
  it("round-trips a saved state", () => {
    const s = { byQuestion: { q1: { attempts: 1, lastResult: "correct" as const, lastAnsweredAt: 1 } }, byTopic: { t1: { answered: 1, correct: 1, partial: 0 } } };
    saveState(s);
    expect(loadState()).toEqual(s);
  });
});

describe("resetState", () => {
  it("removes the stored state", () => {
    saveState({ byQuestion: {}, byTopic: { t1: { answered: 1, correct: 0, partial: 0 } } });
    resetState();
    expect(loadState()).toEqual(EMPTY_STATE);
  });
});

describe("recordAnswer", () => {
  it("records a first correct answer", () => {
    const next = recordAnswer(EMPTY_STATE, "q1", "t1", "correct");
    expect(next.byQuestion.q1.attempts).toBe(1);
    expect(next.byQuestion.q1.lastResult).toBe("correct");
    expect(next.byTopic.t1).toEqual({ answered: 1, correct: 1, partial: 0 });
  });

  it("increments attempts but keeps answered count stable on re-answer", () => {
    const s1 = recordAnswer(EMPTY_STATE, "q1", "t1", "wrong");
    const s2 = recordAnswer(s1, "q1", "t1", "correct");
    expect(s2.byQuestion.q1.attempts).toBe(2);
    expect(s2.byTopic.t1.answered).toBe(1);
    expect(s2.byTopic.t1.correct).toBe(1);
  });

  it("handles wrong -> partial correctly", () => {
    const s1 = recordAnswer(EMPTY_STATE, "q1", "t1", "wrong");
    const s2 = recordAnswer(s1, "q1", "t1", "partial");
    expect(s2.byTopic.t1).toEqual({ answered: 1, correct: 0, partial: 1 });
  });

  it("handles correct -> wrong correctly (decrements correct)", () => {
    const s1 = recordAnswer(EMPTY_STATE, "q1", "t1", "correct");
    const s2 = recordAnswer(s1, "q1", "t1", "wrong");
    expect(s2.byTopic.t1).toEqual({ answered: 1, correct: 0, partial: 0 });
  });

  it("aggregates multiple questions on the same topic", () => {
    let s = recordAnswer(EMPTY_STATE, "q1", "t1", "correct");
    s = recordAnswer(s, "q2", "t1", "partial");
    s = recordAnswer(s, "q3", "t1", "wrong");
    expect(s.byTopic.t1).toEqual({ answered: 3, correct: 1, partial: 1 });
  });
});
