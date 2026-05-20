/* ─────────────────────────────────────────────
   CharacterPortrait — Phase 2
   SVG silhouette portraits for all 25 characters
   Styled with their accent color
───────────────────────────────────────────── */

interface PortraitProps {
  characterId: string;
  accentHex: string;
  size?: number;
}

/* SVG path data for each character type */
const PORTRAITS: Record<string, string> = {
  /* Archer — Arjuna, Karna, Drupada, Nakula */
  archer: `M50 85 C50 70 42 58 35 48 C28 38 30 22 40 18 C50 14 60 22 60 32 C60 38 56 44 52 48 C46 56 50 68 50 85Z M35 50 L20 70 M65 50 L75 55 L72 70`,

  /* King with crown — Yudhishthira, Duryodhana, Dhritarashtra, Virata */
  king: `M50 90 C50 75 42 62 38 52 C34 42 36 30 42 24 C38 20 35 14 38 10 L42 16 L46 8 L50 16 L54 8 L58 16 L62 10 C65 14 62 20 58 24 C64 30 66 42 62 52 C58 62 50 75 50 90Z`,

  /* Warrior with sword — Bhima, Bhishma, Ashwatthama, Ghatotkacha */
  warrior: `M50 88 C50 72 44 60 38 50 C32 40 34 26 42 20 C36 16 34 8 40 6 C46 4 50 10 50 16 C50 10 54 4 60 6 C66 8 64 16 58 20 C66 26 68 40 62 50 C56 60 50 72 50 88Z M30 55 L15 75 M70 55 L80 65`,

  /* Sage with staff — Krishna, Vyasa, Drona, Vidura, Parashurama */
  sage: `M50 88 C50 74 44 62 40 52 C36 42 38 28 44 22 C40 16 40 8 46 6 C52 4 58 8 60 14 C62 8 65 4 68 8 L65 20 C68 28 66 42 60 52 C56 62 50 74 50 88Z M50 22 L50 88 M44 70 L56 70`,

  /* Woman — Draupadi, Kunti, Gandhari, Subhadra, Hidimbi */
  woman: `M50 88 C44 74 36 62 34 52 C32 42 36 30 42 24 C40 18 40 10 46 8 C52 6 60 10 60 18 C64 24 66 36 62 50 C60 60 56 74 50 88Z M36 38 C32 42 30 50 32 58 M64 38 C68 42 70 50 68 58`,

  /* Divine — Hanuman */
  divine: `M50 85 C44 72 36 60 32 48 C28 36 32 22 40 16 C44 12 48 8 50 6 C52 8 56 12 60 16 C68 22 72 36 68 48 C64 60 56 72 50 85Z M30 30 L20 20 M70 30 L80 20 M50 85 L44 95 M50 85 L56 95`,

  /* Young warrior — Abhimanyu */
  young: `M50 86 C50 72 44 60 40 50 C36 40 38 28 44 22 C42 16 42 10 48 8 C54 6 58 10 58 16 C62 22 62 34 60 44 C56 54 50 70 50 86Z`,

  /* Elder king — Pandu, Shakuni, Dushasana, Jayadratha, Shalya */
  elder: `M50 88 C50 74 43 62 38 52 C33 42 35 28 41 22 C37 16 37 8 43 7 C49 6 55 10 57 16 C60 10 63 6 66 9 L63 20 C67 28 65 42 60 52 C55 62 50 74 50 88Z`,
};

/* Map each character to a portrait type */
const CHARACTER_PORTRAIT: Record<string, keyof typeof PORTRAITS> = {
  yudhishthira: "king",
  bhima:        "warrior",
  arjuna:       "archer",
  nakula:       "archer",
  sahadeva:     "sage",
  duryodhana:   "king",
  dushasana:    "elder",
  shakuni:      "elder",
  draupadi:     "woman",
  kunti:        "woman",
  gandhari:     "woman",
  subhadra:     "woman",
  hidimbi:      "woman",
  karna:        "archer",
  bhishma:      "warrior",
  drona:        "sage",
  ashwatthama:  "warrior",
  abhimanyu:    "young",
  ghatotkacha:  "warrior",
  jayadratha:   "elder",
  krishna:      "sage",
  hanuman:      "divine",
  vyasa:        "sage",
  vidura:       "sage",
  parashurama:  "sage",
  dhritarashtra:"king",
  pandu:        "elder",
  drupada:      "king",
  virata:       "king",
  shalya:       "elder",
};

const CharacterPortrait = ({ characterId, accentHex, size = 64 }: PortraitProps) => {
  const portraitKey = CHARACTER_PORTRAIT[characterId] ?? "warrior";
  const pathData    = PORTRAITS[portraitKey] ?? PORTRAITS.warrior;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Glow circle background */}
      <circle
        cx="50" cy="45" r="38"
        fill={accentHex}
        opacity="0.12"
      />
      <circle
        cx="50" cy="45" r="38"
        stroke={accentHex}
        strokeWidth="0.5"
        opacity="0.3"
        fill="none"
      />

      {/* Silhouette */}
      <path
        d={pathData}
        fill={accentHex}
        opacity="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Subtle stroke for definition */}
      <path
        d={pathData}
        stroke={accentHex}
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
};

export default CharacterPortrait;
