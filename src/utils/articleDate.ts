/**
 * Article dates are authored for humans ("April 10, 2026") because that is
 * what renders on the page. Schema.org's datePublished, though, is defined
 * as ISO 8601 — Google reads a non-ISO value as malformed and drops the
 * date from the rich result, so the two need separating.
 */

const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08",
  september: "09", october: "10", november: "11", december: "12",
};

/**
 * "April 10, 2026" -> "2026-04-10". Passes ISO input through untouched, so
 * it is safe to call on dates from either era of the dataset. Returns "" for
 * anything unparseable, which callers should treat as "omit the field"
 * rather than emitting a wrong date.
 */
export function toIsoDate(input: string | undefined | null): string {
  if (!input) return "";
  const s = String(input).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const m = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (!m) return "";
  const month = MONTHS[m[1].toLowerCase()];
  if (!month) return "";
  return `${m[3]}-${month}-${m[2].padStart(2, "0")}`;
}
