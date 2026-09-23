import { setWaveMood } from "@/components/shapes/shapesScene";
import { NEUTRAL_MOOD, type WaveMood, type WaveMoodAnswer } from "@/components/shapes/waveMood";

// Stands in for the AI when there is no API key to spend. It answers with the same shape as the route
// (`WaveMoodAnswer`) and after a delay like a network call, so the code that asks for a mood does not change
// between the two. It picks by keyword; the real one reads the prompt.

const MOCK_DELAY_MS = 700;

// A preset only names the dials it moves; the rest stay at rest (`NEUTRAL_MOOD`, which has no colour).
const PRESETS: { words: string[]; answer: Partial<WaveMood> & { label: string } }[] = [
  { words: ["azul", "blue"], answer: { hue: 215, tint: 0.85, label: "azul" } },
  { words: ["verde", "floresta", "green"], answer: { hue: 130, tint: 0.85, calm: 0.7, label: "verde" } },
  { words: ["amarelo", "yellow"], answer: { hue: 55, tint: 0.85, warmth: 0.5, label: "amarelo" } },
  { words: ["calm", "oceano", "noite", "sono", "paz", "sereno", "silen"], answer: { calm: 1, energy: 0.3, warmth: -0.3, speed: 0.15, label: "calmo e lento" } },
  { words: ["tempestade", "caos", "raiva", "furia", "fúria", "storm", "ansios"], answer: { calm: 0, energy: 1, warmth: -0.2, speed: 0.95, label: "tempestade" } },
  { words: ["quente", "sol", "verao", "verão", "por do sol", "pôr do sol", "warm", "festa"], answer: { calm: 0.6, energy: 0.65, warmth: 1, speed: 0.55, label: "quente, ao pôr do sol" } },
  { words: ["frio", "gelo", "inverno", "cool", "cold"], answer: { calm: 0.8, energy: 0.4, warmth: -1, speed: 0.3, label: "frio e quieto" } },
  { words: ["rapido", "rápido", "energia", "vibrante", "fast"], answer: { calm: 0.25, energy: 0.85, warmth: 0.3, speed: 1, label: "vibrante" } },
];

export const mockWaveMood = (prompt: string): Promise<WaveMoodAnswer> => {
  const text = prompt.toLowerCase();
  const hit = PRESETS.find(({ words }) => words.some((word) => text.includes(word)));
  const answer: WaveMoodAnswer = { ...NEUTRAL_MOOD, label: "clima neutro", ...hit?.answer };
  return new Promise((resolve) => setTimeout(() => resolve(answer), MOCK_DELAY_MS));
};

/** Asks the route what mood a phrase is. Throws if it does not answer, so the caller can decide what to show. */
export const fetchWaveMood = async (prompt: string): Promise<WaveMoodAnswer> => {
  const response = await fetch("/api/wave-mood", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error(`wave-mood ${response.status}`);
  return response.json();
};

/**
 * Development only: `waveMood("domingo chuvoso")` in the browser console asks the route and moves the waves, so
 * the eased change can be tried before there is any input on the page. If the route does not answer (no API key
 * yet, a pause between calls), it says so and uses the mock instead. Not installed in production.
 */
export const installWaveMoodConsole = () => {
  if (process.env.NODE_ENV !== "development") return;
  (window as unknown as { waveMood: (prompt: string) => Promise<WaveMoodAnswer> }).waveMood = async (prompt) => {
    const answer = await fetchWaveMood(prompt).catch((error: unknown) => {
      console.warn(`waveMood: the route did not answer (${error instanceof Error ? error.message : error}); using the mock.`);
      return mockWaveMood(prompt);
    });
    setWaveMood(answer);
    return answer;
  };
};
