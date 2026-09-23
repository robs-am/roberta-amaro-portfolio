import { moodFromParam, moodToParam, type WaveMood, type WaveMoodAnswer } from "@/components/shapes/waveMood";

// The browser's side of `/api/wave-mood`: what the visitor typed goes in, the dials and a short label come out.
export class WaveMoodError extends Error {
  constructor(readonly status: number) {
    super(`wave-mood ${status}`);
  }
}

// The last mood is kept for the tab's session only: a reload keeps it, and a new visit starts from the design.
// Storage can be missing or blocked (private windows), so every use is guarded and the page works without it.
const SAVED_KEY = "wave-mood";
const MAX_LABEL_LENGTH = 40;

export const readSavedMood = (): { mood: WaveMood; label: string } | null => {
  try {
    const raw = sessionStorage.getItem(SAVED_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { param?: unknown; label?: unknown };
    const mood = typeof saved.param === "string" ? moodFromParam(saved.param) : null;
    if (!mood) return null;
    return { mood, label: typeof saved.label === "string" ? saved.label.slice(0, MAX_LABEL_LENGTH) : "" };
  } catch {
    return null;
  }
};

export const saveMood = (mood: WaveMood, label: string) => {
  try {
    sessionStorage.setItem(SAVED_KEY, JSON.stringify({ param: moodToParam(mood), label }));
  } catch {}
};

export const clearSavedMood = () => {
  try {
    sessionStorage.removeItem(SAVED_KEY);
  } catch {}
};

/** Asks the route what mood a phrase is. Throws a `WaveMoodError` when it does not answer (429 is "too soon"). */
export const fetchWaveMood = async (prompt: string): Promise<WaveMoodAnswer> => {
  const response = await fetch("/api/wave-mood", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new WaveMoodError(response.status);
  return response.json();
};
