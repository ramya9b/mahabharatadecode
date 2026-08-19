/* ─────────────────────────────────────────────
   Story Teller client — MahabharataDecoded

   Generation runs in the /api/story function, which holds the Groq
   and Gemini keys and builds the prompts. The browser sends only
   structured parameters, so no key is shipped to the client and the
   endpoint can't be repurposed as a general-purpose LLM.

   Routing (English → Groq, regional → Gemini) lives server-side too.
───────────────────────────────────────────── */

export type Tone = "epic" | "devotional" | "kids" | "philosophical";
export type Language = "en" | "te" | "hi" | "kn";
export interface StoryRequest      { characterName: string; prompt: string; tone: Tone; language: Language; }
export interface StoryResponse     { story: string; error?: string; }
export interface LifeLessonRequest  { characterName: string; storyContext: string; language: Language; }
export interface MySituationRequest { characterName: string; storyContext: string; userSituation: string; language: Language; }

const STORY_ENDPOINT = "/api/story";

type StoryKind = "story" | "lesson" | "situation";

async function callStoryApi(
  kind: StoryKind,
  payload: Record<string, unknown>,
): Promise<StoryResponse> {
  try {
    const res = await fetch(STORY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, ...payload }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.success) {
      return { story: "", error: data?.error || `Story generation failed (${res.status})` };
    }
    return { story: data.story ?? "" };
  } catch (err) {
    return { story: "", error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/* ── Public API — unchanged signatures ── */
export async function generateStory(req: StoryRequest): Promise<StoryResponse> {
  return callStoryApi("story", {
    characterName: req.characterName,
    prompt: req.prompt,
    tone: req.tone,
    language: req.language,
  });
}

export async function generateLifeLesson(req: LifeLessonRequest): Promise<StoryResponse> {
  return callStoryApi("lesson", {
    characterName: req.characterName,
    storyContext: req.storyContext,
    language: req.language,
  });
}

export async function generateMySituation(req: MySituationRequest): Promise<StoryResponse> {
  return callStoryApi("situation", {
    characterName: req.characterName,
    storyContext: req.storyContext,
    userSituation: req.userSituation,
    language: req.language,
  });
}
