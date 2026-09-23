import type { WaveMoodAnswer } from "@/components/shapes/waveMood";

// The browser's side of `/api/wave-mood`: what the visitor typed goes in, the dials and a short label come out.
export class WaveMoodError extends Error {
  constructor(readonly status: number) {
    super(`wave-mood ${status}`);
  }
}

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
