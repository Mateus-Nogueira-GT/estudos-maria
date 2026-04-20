import { describe, it, expect } from "vitest";
import { topicMastery, masteryBand, formatPct } from "./progress";
import type { ProgressState } from "./storage";

const emptyState: ProgressState = { byQuestion: {}, byTopic: {} };

describe("topicMastery", () => {
  it("returns 0 for empty state", () => {
    expect(topicMastery(emptyState, "t1", 10)).toBe(0);
  });
  it("returns 0 when totalQuestions is 0", () => {
    const s: ProgressState = {
      byQuestion: {},
      byTopic: { t1: { answered: 1, correct: 1, partial: 0 } },
    };
    expect(topicMastery(s, "t1", 0)).toBe(0);
  });
  it("computes correct fraction", () => {
    const s: ProgressState = {
      byQuestion: {},
      byTopic: { t1: { answered: 2, correct: 1, partial: 0 } },
    };
    expect(topicMastery(s, "t1", 10)).toBeCloseTo(0.1, 5);
  });
  it("weights partial as 0.5", () => {
    const s: ProgressState = {
      byQuestion: {},
      byTopic: { t1: { answered: 2, correct: 1, partial: 2 } },
    };
    // (1 + 0.5*2) / 10 = 0.2
    expect(topicMastery(s, "t1", 10)).toBeCloseTo(0.2, 5);
  });
  it("clamps to [0, 1]", () => {
    const s: ProgressState = {
      byQuestion: {},
      byTopic: { t1: { answered: 20, correct: 20, partial: 5 } },
    };
    // (20 + 2.5) / 10 = 2.25 → clamped to 1
    expect(topicMastery(s, "t1", 10)).toBe(1);
  });
});

describe("masteryBand", () => {
  it("classifies low (<34%)", () => {
    expect(masteryBand(0)).toBe("low");
    expect(masteryBand(0.33)).toBe("low");
  });
  it("classifies mid (34-66%)", () => {
    expect(masteryBand(0.34)).toBe("mid");
    expect(masteryBand(0.5)).toBe("mid");
    expect(masteryBand(0.66)).toBe("mid");
  });
  it("classifies high (≥67%)", () => {
    expect(masteryBand(0.67)).toBe("high");
    expect(masteryBand(1)).toBe("high");
  });
});

describe("formatPct", () => {
  it("rounds to nearest integer and appends %", () => {
    expect(formatPct(0)).toBe("0%");
    expect(formatPct(0.334)).toBe("33%");
    expect(formatPct(0.666)).toBe("67%");
    expect(formatPct(1)).toBe("100%");
  });
});
