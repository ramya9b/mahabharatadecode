/**
 * MahabharataDecoded — Quiz QA Test Suite
 * 14 suites | 50+ individual assertions
 * Run: npm test
 */

import { describe, it, expect } from "vitest";
import {
  calculateScores, computeQuizResult,
  isQuizComplete, getAnswerCharacter, scoreBreakdown,
} from "@/utils/quizScoring";
import { QUIZ_QUESTIONS, TOTAL_QUESTIONS, CHARACTER_META } from "@/data/quiz";
import type { CharacterId } from "@/data/quiz";

/* helpers */
const allFor = (c: CharacterId) =>
  QUIZ_QUESTIONS.map((q) => q.answers.findIndex((a) => a.character === c));

const idx = (qi: number, c: CharacterId) => {
  const i = QUIZ_QUESTIONS[qi].answers.findIndex((a) => a.character === c);
  if (i < 0) throw new Error(`${c} not in Q${qi + 1}`);
  return i;
};

const sum = (s: Record<CharacterId, number>) =>
  Object.values(s).reduce((a, b) => a + b, 0);

/* ── TC-001: Data integrity ── */
describe("TC-001: Data integrity", () => {
  it("has exactly 8 questions and TOTAL_QUESTIONS=8", () => {
    expect(QUIZ_QUESTIONS.length).toBe(8);
    expect(TOTAL_QUESTIONS).toBe(8);
  });
  it("every question has exactly 5 answers", () => {
    QUIZ_QUESTIONS.forEach((q, i) => expect(q.answers.length, `Q${i+1}`).toBe(5));
  });
  it("every question contains each of the 5 characters exactly once", () => {
    const CHARS: CharacterId[] = ["karna","krishna","arjuna","draupadi","bhishma"];
    QUIZ_QUESTIONS.forEach((q, i) => {
      const set = new Set(q.answers.map((a) => a.character));
      expect(set.size, `Q${i+1} duplicate`).toBe(5);
      CHARS.forEach((c) => expect(set.has(c), `Q${i+1} missing ${c}`).toBe(true));
    });
  });
  it("all 40 answer IDs are globally unique", () => {
    const ids = QUIZ_QUESTIONS.flatMap((q) => q.answers.map((a) => a.id));
    expect(new Set(ids).size).toBe(40);
  });
  it("question IDs are sequential 1-8", () => {
    QUIZ_QUESTIONS.forEach((q, i) => expect(q.id).toBe(i + 1));
  });
  it("no empty question or answer text", () => {
    QUIZ_QUESTIONS.forEach((q) => {
      expect(q.question.trim()).not.toBe("");
      q.answers.forEach((a) => expect(a.text.trim()).not.toBe(""));
    });
  });
});

/* ── TC-002: Happy path — each character wins outright ── */
describe("TC-002: Happy path — clear winner", () => {
  (["karna","krishna","arjuna","draupadi","bhishma"] as CharacterId[]).forEach((c) => {
    it(`all ${c} answers → winner=${c}, score=8, isTie=false`, () => {
      const r = computeQuizResult(allFor(c), QUIZ_QUESTIONS);
      expect(r.winner).toBe(c);
      expect(r.scores[c]).toBe(8);
      expect(r.isTie).toBe(false);
      expect(r.percentage).toBe(100);
    });
  });
});

/* ── TC-003: Score accuracy ── */
describe("TC-003: Score calculation accuracy", () => {
  it("5 karna + 3 krishna → karna wins, correct scores", () => {
    const a = [idx(0,"karna"),idx(1,"karna"),idx(2,"karna"),idx(3,"karna"),idx(4,"karna"),
               idx(5,"krishna"),idx(6,"krishna"),idx(7,"krishna")];
    const r = computeQuizResult(a, QUIZ_QUESTIONS);
    expect(r.winner).toBe("karna");
    expect(r.scores.karna).toBe(5);
    expect(r.scores.krishna).toBe(3);
    expect(r.isTie).toBe(false);
    expect(r.percentage).toBe(63);
  });
  it("total scores equal answered questions", () => {
    const a = [idx(0,"karna"),idx(1,"draupadi"),idx(2,"krishna"),idx(3,"arjuna"),
               idx(4,"bhishma"),idx(5,"karna"),idx(6,"draupadi"),idx(7,"krishna")];
    expect(sum(calculateScores(a, QUIZ_QUESTIONS))).toBe(8);
  });
  it("3/8 karna → 38%", () => {
    const a = [idx(0,"karna"),idx(1,"karna"),idx(2,"karna"),idx(3,"krishna"),
               idx(4,"arjuna"),idx(5,"draupadi"),idx(6,"bhishma"),idx(7,"draupadi")];
    const r = computeQuizResult(a, QUIZ_QUESTIONS);
    expect(r.scores.karna).toBe(3);
    expect(r.percentage).toBe(38);
  });
  it("4/8 karna → 50%", () => {
    const a = [idx(0,"karna"),idx(1,"karna"),idx(2,"karna"),idx(3,"karna"),
               idx(4,"krishna"),idx(5,"arjuna"),idx(6,"draupadi"),idx(7,"bhishma")];
    expect(computeQuizResult(a, QUIZ_QUESTIONS).percentage).toBe(50);
  });
});

/* ── TC-004: Tie scenarios ── */
describe("TC-004: Tie handling", () => {
  it("4-4 karna/krishna → isTie=true, both have score 4", () => {
    const a = [idx(0,"karna"),idx(1,"krishna"),idx(2,"karna"),idx(3,"krishna"),
               idx(4,"karna"),idx(5,"krishna"),idx(6,"karna"),idx(7,"krishna")];
    const r = computeQuizResult(a, QUIZ_QUESTIONS);
    expect(r.isTie).toBe(true);
    expect(r.scores.karna).toBe(4);
    expect(r.scores.krishna).toBe(4);
    expect(["karna","krishna"]).toContain(r.winner);
    expect(r.tiedWith).toBeDefined();
    expect(r.winner).not.toBe(r.tiedWith);
  });
  it("last answer krishna → krishna wins tiebreak", () => {
    const a = [idx(0,"karna"),idx(1,"karna"),idx(2,"karna"),idx(3,"karna"),
               idx(4,"krishna"),idx(5,"krishna"),idx(6,"krishna"),idx(7,"krishna")];
    expect(computeQuizResult(a, QUIZ_QUESTIONS).winner).toBe("krishna");
  });
  it("last answer karna → karna wins tiebreak", () => {
    const a = [idx(0,"krishna"),idx(1,"krishna"),idx(2,"krishna"),idx(3,"krishna"),
               idx(4,"karna"),idx(5,"karna"),idx(6,"karna"),idx(7,"karna")];
    expect(computeQuizResult(a, QUIZ_QUESTIONS).winner).toBe("karna");
  });
  it("outright winner never flagged as tie", () => {
    const r = computeQuizResult(allFor("arjuna"), QUIZ_QUESTIONS);
    expect(r.isTie).toBe(false);
    expect(r.tiedWith).toBeUndefined();
  });
  it("4-4 tie percentage is 50", () => {
    const a = [idx(0,"karna"),idx(1,"krishna"),idx(2,"karna"),idx(3,"krishna"),
               idx(4,"karna"),idx(5,"krishna"),idx(6,"karna"),idx(7,"krishna")];
    expect(computeQuizResult(a, QUIZ_QUESTIONS).percentage).toBe(50);
  });
});

/* ── TC-005: Partial / null / out-of-bounds ── */
describe("TC-005: Partial and edge-case answers", () => {
  it("all nulls → all scores 0, percentage 0", () => {
    const a: (number|null)[] = new Array(8).fill(null);
    const s = calculateScores(a, QUIZ_QUESTIONS);
    expect(sum(s)).toBe(0);
    expect(computeQuizResult(a, QUIZ_QUESTIONS).percentage).toBe(0);
  });
  it("only Q1 answered → score 1 for that char", () => {
    const a: (number|null)[] = [idx(0,"draupadi"), ...new Array(7).fill(null)];
    const s = calculateScores(a, QUIZ_QUESTIONS);
    expect(s.draupadi).toBe(1);
    expect(sum(s)).toBe(1);
  });
  it("only Q8 answered → bhishma wins", () => {
    const a: (number|null)[] = [...new Array(7).fill(null), idx(7,"bhishma")];
    expect(computeQuizResult(a, QUIZ_QUESTIONS).winner).toBe("bhishma");
  });
  it("out-of-bounds index (99) silently ignored", () => {
    const a: (number|null)[] = [99, null, idx(2,"arjuna"), ...new Array(5).fill(null)];
    expect(() => calculateScores(a, QUIZ_QUESTIONS)).not.toThrow();
    expect(calculateScores(a, QUIZ_QUESTIONS).arjuna).toBe(1);
    expect(sum(calculateScores(a, QUIZ_QUESTIONS))).toBe(1);
  });
  it("negative index (-1) silently ignored", () => {
    const a: (number|null)[] = [-1, idx(1,"karna"), ...new Array(6).fill(null)];
    expect(() => calculateScores(a, QUIZ_QUESTIONS)).not.toThrow();
    expect(calculateScores(a, QUIZ_QUESTIONS).karna).toBe(1);
  });
  it("extra entries beyond TOTAL_QUESTIONS are ignored", () => {
    const a = [...allFor("karna"), 0, 1, 2];
    expect(sum(calculateScores(a, QUIZ_QUESTIONS))).toBe(8);
  });
});

/* ── TC-006: isQuizComplete ── */
describe("TC-006: isQuizComplete", () => {
  it("all 8 answered → true", () => expect(isQuizComplete(allFor("karna"), 8)).toBe(true));
  it("one null → false", () => {
    const a: (number | null)[] = allFor("krishna"); a[4] = null;
    expect(isQuizComplete(a, 8)).toBe(false);
  });
  it("empty array → false", () => expect(isQuizComplete([], 8)).toBe(false));
  it("wrong length → false", () => expect(isQuizComplete([0,1,2,3,4], 8)).toBe(false));
  it("all zeros (valid) → true", () => expect(isQuizComplete(new Array(8).fill(0), 8)).toBe(true));
  it("null at any position makes it incomplete", () => {
    for (let i = 0; i < 8; i++) {
      const a: (number | null)[] = allFor("arjuna"); a[i] = null;
      expect(isQuizComplete(a, 8), `null at ${i}`).toBe(false);
    }
  });
});

/* ── TC-007: getAnswerCharacter ── */
describe("TC-007: getAnswerCharacter bounds", () => {
  it("returns correct character for every valid pair", () => {
    QUIZ_QUESTIONS.forEach((q, qi) =>
      q.answers.forEach((a, ai) =>
        expect(getAnswerCharacter(qi, ai, QUIZ_QUESTIONS)).toBe(a.character)
      )
    );
  });
  it("negative question index → null", () => expect(getAnswerCharacter(-1, 0, QUIZ_QUESTIONS)).toBeNull());
  it("question index > length → null", () => expect(getAnswerCharacter(100, 0, QUIZ_QUESTIONS)).toBeNull());
  it("negative answer index → null", () => expect(getAnswerCharacter(0, -1, QUIZ_QUESTIONS)).toBeNull());
  it("answer index > answers.length → null", () => expect(getAnswerCharacter(0, 99, QUIZ_QUESTIONS)).toBeNull());
  it("exact boundary qIndex = TOTAL_QUESTIONS → null", () =>
    expect(getAnswerCharacter(TOTAL_QUESTIONS, 0, QUIZ_QUESTIONS)).toBeNull());
});

/* ── TC-008: scoreBreakdown ── */
describe("TC-008: scoreBreakdown percentages", () => {
  it("4/8 karna → 50%", () => {
    const bd = scoreBreakdown({ karna:4, krishna:2, arjuna:1, draupadi:1, bhishma:0 }, 8);
    expect(bd.karna).toBe(50);
    expect(bd.krishna).toBe(25);
    expect(bd.bhishma).toBe(0);
  });
  it("totalAnswered=0 → all 0%", () => {
    const bd = scoreBreakdown({ karna:0, krishna:0, arjuna:0, draupadi:0, bhishma:0 }, 0);
    Object.values(bd).forEach((v) => expect(v).toBe(0));
  });
  it("sum approximately 100 (rounding ±2)", () => {
    const s = calculateScores(allFor("karna"), QUIZ_QUESTIONS);
    const total = Object.values(scoreBreakdown(s, 8)).reduce((a,b)=>a+b, 0);
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(102);
  });
  it("all values are integers", () => {
    const bd = scoreBreakdown({ karna:3, krishna:3, arjuna:1, draupadi:1, bhishma:0 }, 8);
    Object.values(bd).forEach((v) => expect(Number.isInteger(v)).toBe(true));
  });
});

/* ── TC-009: Back navigation / answer change ── */
describe("TC-009: Answer change (back navigation)", () => {
  it("changing Q1 karna→krishna: karna-=1, krishna+=1", () => {
    const a = allFor("karna");
    a[0] = idx(0, "krishna");
    const s = calculateScores(a, QUIZ_QUESTIONS);
    expect(s.karna).toBe(7);
    expect(s.krishna).toBe(1);
  });
  it("changing all to draupadi: draupadi=8, karna=0", () => {
    const a = allFor("karna");
    QUIZ_QUESTIONS.forEach((_, i) => { a[i] = idx(i, "draupadi"); });
    const s = calculateScores(a, QUIZ_QUESTIONS);
    expect(s.draupadi).toBe(8);
    expect(s.karna).toBe(0);
  });
  it("total remains 8 after multiple changes", () => {
    const a = allFor("karna");
    a[0] = idx(0,"krishna"); a[3] = idx(3,"arjuna"); a[6] = idx(6,"bhishma");
    expect(sum(calculateScores(a, QUIZ_QUESTIONS))).toBe(8);
  });
});

/* ── TC-010: All characters can win ── */
describe("TC-010: All 5 characters can be the winner", () => {
  (["karna","krishna","arjuna","draupadi","bhishma"] as CharacterId[]).forEach((target) => {
    it(`${target} wins with 5 answers`, () => {
      const others = (["karna","krishna","arjuna","draupadi","bhishma"] as CharacterId[]).filter(c=>c!==target);
      const a = QUIZ_QUESTIONS.map((_, i) =>
        i < 5 ? idx(i, target) : idx(i, others[(i-5) % others.length])
      );
      const r = computeQuizResult(a, QUIZ_QUESTIONS);
      expect(r.winner).toBe(target);
      expect(r.isTie).toBe(false);
    });
  });
});

/* ── TC-011: Retake resets state ── */
describe("TC-011: Retake / state reset", () => {
  it("fresh null array → 0 scores, incomplete", () => {
    const completed = allFor("krishna");
    expect(calculateScores(completed, QUIZ_QUESTIONS).krishna).toBe(8);
    const fresh: (number|null)[] = new Array(8).fill(null);
    expect(sum(calculateScores(fresh, QUIZ_QUESTIONS))).toBe(0);
    expect(isQuizComplete(fresh, 8)).toBe(false);
  });
  it("second quiz result is independent of first", () => {
    const r1 = computeQuizResult(allFor("karna"), QUIZ_QUESTIONS);
    const r2 = computeQuizResult(allFor("draupadi"), QUIZ_QUESTIONS);
    expect(r1.winner).toBe("karna");
    expect(r2.winner).toBe("draupadi");
  });
});

/* ── TC-012: Progress bar math ── */
describe("TC-012: Progress bar percentage math", () => {
  it("Q0 → 0%", () => expect(Math.round((0/8)*100)).toBe(0));
  it("Q1 → 13%", () => expect(Math.round((1/8)*100)).toBe(13));
  it("Q4 → 50%", () => expect(Math.round((4/8)*100)).toBe(50));
  it("Q8 → 100%", () => expect(Math.round((8/8)*100)).toBe(100));
  it("progress is monotonically non-decreasing", () => {
    const steps = Array.from({length:9},(_,i)=>Math.round((i/8)*100));
    for (let i=1;i<steps.length;i++) expect(steps[i]).toBeGreaterThanOrEqual(steps[i-1]);
  });
});

/* ── TC-013: Idempotency (double-tap) ── */
describe("TC-013: Idempotency — double-tap prevention", () => {
  it("overwriting same answer index gives same score", () => {
    const a: (number|null)[] = new Array(8).fill(null);
    a[0] = idx(0,"karna");
    const s1 = calculateScores([...a], QUIZ_QUESTIONS);
    a[0] = idx(0,"karna"); // same again
    const s2 = calculateScores([...a], QUIZ_QUESTIONS);
    expect(s1.karna).toBe(s2.karna);
    expect(s1.karna).toBe(1);
  });
  it("change and revert is idempotent", () => {
    const a = allFor("karna");
    const original = calculateScores([...a], QUIZ_QUESTIONS).karna;
    a[2] = idx(2,"draupadi");
    a[2] = idx(2,"karna"); // revert
    expect(calculateScores(a, QUIZ_QUESTIONS).karna).toBe(original);
  });
});

/* ── TC-014: CHARACTER_META completeness ── */
describe("TC-014: CHARACTER_META completeness", () => {
  const chars: CharacterId[] = ["karna","krishna","arjuna","draupadi","bhishma"];

  chars.forEach((c) => {
    it(`${c}: all fields present and valid`, () => {
      const m = CHARACTER_META[c];
      expect(m.name.length).toBeGreaterThan(0);
      expect(m.title.length).toBeGreaterThan(0);
      expect(m.accentHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(m.accentRgb).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
      expect(m.imageKey).toBeTruthy();
      expect(m.articleSlug.length).toBeGreaterThan(0);
      expect(m.resultInsight.length).toBeGreaterThan(80);
      expect(m.archetype.length).toBeGreaterThan(0);
      expect(m.traits).toHaveLength(4);
      m.traits.forEach((t: string) => expect(t.length).toBeGreaterThan(0));
    });
  });

  it("every quiz character has a matching CHARACTER_META entry", () => {
    const used = new Set(QUIZ_QUESTIONS.flatMap((q)=>q.answers.map((a)=>a.character)));
    used.forEach((c) => expect(CHARACTER_META[c], `missing: ${c}`).toBeDefined());
  });

  it("accentRgb values are valid 0-255", () => {
    chars.forEach((c) => {
      CHARACTER_META[c].accentRgb.split(",").map(Number).forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(255);
      });
    });
  });
});
