import type { CharacterId, QuizQuestion, QuizResult } from "@/data/quiz";

/* ─────────────────────────────────────────────────────────
   SCORING ENGINE
   Pure functions — no side effects, fully unit-testable.
───────────────────────────────────────────────────────── */

/**
 * Calculate raw scores from a set of answers.
 * answers[i] = index of selected answer for question i, or null if unanswered.
 */
export function calculateScores(
  answers: (number | null)[],
  questions: QuizQuestion[]
): Record<CharacterId, number> {
  const scores: Record<CharacterId, number> = {
    karna: 0,
    krishna: 0,
    arjuna: 0,
    draupadi: 0,
    bhishma: 0,
  };

  answers.forEach((answerIndex, questionIndex) => {
    // Skip unanswered questions
    if (answerIndex === null || answerIndex === undefined) return;
    // Guard: question must exist
    if (questionIndex >= questions.length) return;
    // Guard: answer must exist within question
    const question = questions[questionIndex];
    if (answerIndex < 0 || answerIndex >= question.answers.length) return;

    const answer = question.answers[answerIndex];
    scores[answer.character]++;
  });

  return scores;
}

/**
 * Determine the quiz result from calculated scores.
 * Tie-breaking priority:
 *   1. Highest score wins outright.
 *   2. If tied, check who answered last (last question's character wins).
 *   3. If still tied after (e.g. no answers), fall back to alphabetical.
 * Returns both the single winner AND tie information for display.
 */
export function determineResult(
  scores: Record<CharacterId, number>,
  answers: (number | null)[],
  questions: QuizQuestion[]
): QuizResult {
  const charIds: CharacterId[] = ["karna", "krishna", "arjuna", "draupadi", "bhishma"];
  const maxScore = Math.max(...Object.values(scores));
  const totalAnswered = answers.filter((a) => a !== null).length;

  // Find all characters tied at max
  const tied = charIds.filter((c) => scores[c] === maxScore);

  // Percentage based on answered questions (avoid divide-by-zero)
  const percentage = totalAnswered > 0 ? Math.round((maxScore / totalAnswered) * 100) : 0;

  if (tied.length === 1) {
    return {
      winner: tied[0],
      scores,
      isTie: false,
      percentage,
    };
  }

  // ── Tie-breaking: find the character whose answer appeared LAST ──
  let lastWinner: CharacterId | null = null;
  for (let i = answers.length - 1; i >= 0; i--) {
    const ai = answers[i];
    if (ai === null || ai === undefined) continue;
    if (i >= questions.length) continue;
    const q = questions[i];
    if (ai < 0 || ai >= q.answers.length) continue;
    const char = q.answers[ai].character;
    if (tied.includes(char)) {
      lastWinner = char;
      break;
    }
  }

  // ── Final fallback: alphabetical (stable & predictable) ──
  const winner = lastWinner ?? [...tied].sort()[0];
  // The second-place tied character (for "torn between" display)
  const tiedWith = tied.find((c) => c !== winner);

  return {
    winner,
    scores,
    isTie: true,
    tiedWith,
    percentage,
  };
}

/**
 * Full pipeline: answers → result.
 * This is the single function the UI calls.
 */
export function computeQuizResult(
  answers: (number | null)[],
  questions: QuizQuestion[]
): QuizResult {
  const scores = calculateScores(answers, questions);
  return determineResult(scores, answers, questions);
}

/**
 * Validate that a quiz answer set is complete.
 */
export function isQuizComplete(answers: (number | null)[], totalQuestions: number): boolean {
  if (answers.length !== totalQuestions) return false;
  return answers.every((a) => a !== null && a !== undefined);
}

/**
 * Get the character for a specific answer (for display hints).
 */
export function getAnswerCharacter(
  questionIndex: number,
  answerIndex: number,
  questions: QuizQuestion[]
): CharacterId | null {
  if (questionIndex < 0 || questionIndex >= questions.length) return null;
  const q = questions[questionIndex];
  if (answerIndex < 0 || answerIndex >= q.answers.length) return null;
  return q.answers[answerIndex].character;
}

/**
 * Calculate per-character percentage of total answered questions.
 * Used for the score breakdown bars in the result.
 */
export function scoreBreakdown(
  scores: Record<CharacterId, number>,
  totalAnswered: number
): Record<CharacterId, number> {
  if (totalAnswered === 0) {
    return { karna: 0, krishna: 0, arjuna: 0, draupadi: 0, bhishma: 0 };
  }
  const result = {} as Record<CharacterId, number>;
  (Object.keys(scores) as CharacterId[]).forEach((c) => {
    result[c] = Math.round((scores[c] / totalAnswered) * 100);
  });
  return result;
}
