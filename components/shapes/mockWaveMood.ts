import { setWaveMood } from "@/components/shapes/shapesScene";
import { NEUTRAL_MOOD, type WaveMood } from "@/components/shapes/waveMood";

// Stands in for the AI while the real route (`app/api/wave-mood`) does not exist yet. It answers with the same
// shape the route will (`WaveMoodAnswer`) and after a delay like a network call, so the code that asks for a
// mood does not change when this is swapped for a `fetch`. It picks by keyword; the real one reads the prompt.
export type WaveMoodAnswer = WaveMood & { label: string };

const MOCK_DELAY_MS = 700;

const PRESETS: { words: string[]; answer: WaveMoodAnswer }[] = [
  { words: ["calm", "oceano", "noite", "sono", "paz", "sereno", "silen"], answer: { calm: 1, energy: 0.3, warmth: -0.3, speed: 0.15, label: "calmo e lento" } },
  { words: ["tempestade", "caos", "raiva", "furia", "fúria", "storm", "ansios"], answer: { calm: 0, energy: 1, warmth: -0.2, speed: 0.95, label: "tempestade" } },
  { words: ["quente", "sol", "verao", "verão", "por do sol", "pôr do sol", "warm", "festa"], answer: { calm: 0.6, energy: 0.65, warmth: 1, speed: 0.55, label: "quente, ao pôr do sol" } },
  { words: ["frio", "gelo", "inverno", "cool", "cold"], answer: { calm: 0.8, energy: 0.4, warmth: -1, speed: 0.3, label: "frio e quieto" } },
  { words: ["rapido", "rápido", "energia", "vibrante", "fast"], answer: { calm: 0.25, energy: 0.85, warmth: 0.3, speed: 1, label: "vibrante" } },
];

export const mockWaveMood = (prompt: string): Promise<WaveMoodAnswer> => {
  const text = prompt.toLowerCase();
  const hit = PRESETS.find(({ words }) => words.some((word) => text.includes(word)));
  const answer = hit?.answer ?? { ...NEUTRAL_MOOD, label: "clima neutro" };
  return new Promise((resolve) => setTimeout(() => resolve(answer), MOCK_DELAY_MS));
};

/**
 * Development only: `waveMood("tempestade")` in the browser console asks the mock and moves the waves, so the
 * eased change can be tried before there is any input on the page. Not installed in production.
 */
export const installWaveMoodConsole = () => {
  if (process.env.NODE_ENV !== "development") return;
  (window as unknown as { waveMood: (prompt: string) => Promise<WaveMoodAnswer> }).waveMood = async (prompt) => {
    const answer = await mockWaveMood(prompt);
    setWaveMood(answer);
    return answer;
  };
};
