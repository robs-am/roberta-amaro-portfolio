"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { HERO_ENTRANCE_MS, resetWaveMood, setWaveMood } from "@/components/shapes/shapesScene";
import { WaveMoodError, fetchWaveMood } from "@/components/shapes/waveMoodClient";

// Same limit as the route (`MAX_PROMPT_LENGTH`), so the visitor is stopped here instead of by an error.
const MAX_LENGTH = 140;
// A pause after each answer, matching the route's own, so a quick second tap does not just come back "too soon".
const COOLDOWN_MS = 4000;

type Status =
  | { kind: "idle" }
  | { kind: "thinking" }
  | { kind: "done"; label: string }
  | { kind: "error"; message: "moodBusy" | "moodError" };

const buttonClass =
  "inline-flex h-9 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-foreground";

function WaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9c2.5-3 4.5-3 7 0s4.5 3 7 0 3-2.5 6-1" />
      <path d="M2 16c2.5-3 4.5-3 7 0s4.5 3 7 0 3-2.5 6-1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// The visitor's way into the AI feature: a small pill in the hero's lower right corner that opens into a text
// field. What they write goes to `/api/wave-mood`, and the answer moves the waves behind the hero (see
// shapesScene.ts). It sits on the hero, not inside the text column, and is not a `[data-hero-item]`: that would
// count it as text, and the waves would then keep clear of the corner it is in.
export function WaveMoodInput() {
  const t = useTranslations("Hero");
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [cooling, setCooling] = useState(false);
  // Only once a mood has been set is there anything to go back from.
  const [changed, setChanged] = useState(false);
  const [shown, setShown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const cooldown = useRef(0);

  // Comes in once the hero's own entrance is done, so it does not compete with the name and the links.
  useEffect(() => {
    const animated = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    const id = window.setTimeout(() => setShown(true), animated ? HERO_ENTRANCE_MS : 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => () => window.clearTimeout(cooldown.current), []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const thinking = status.kind === "thinking";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const prompt = text.trim();
    if (!prompt || thinking || cooling) return;
    setStatus({ kind: "thinking" });
    try {
      const answer = await fetchWaveMood(prompt);
      setWaveMood(answer);
      setChanged(true);
      setStatus({ kind: "done", label: answer.label });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof WaveMoodError && error.status === 429 ? "moodBusy" : "moodError" });
    }
    setCooling(true);
    cooldown.current = window.setTimeout(() => setCooling(false), COOLDOWN_MS);
  };

  const reset = () => {
    resetWaveMood();
    setChanged(false);
    setText("");
    setStatus({ kind: "idle" });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !open) return;
    setOpen(false);
    toggleRef.current?.focus();
  };

  const message =
    status.kind === "thinking" ? t("moodThinking") : status.kind === "done" ? status.label : status.kind === "error" ? t(status.message) : "";

  return (
    <div
      className={`absolute right-6 bottom-6 z-10 flex flex-col items-end gap-2 transition-opacity duration-700 motion-reduce:transition-none sm:right-8 sm:bottom-8 ${shown ? "opacity-100" : "opacity-0"}`}
    >
      {/* Always in the page, so a screen reader announces what appears in it. */}
      <div role="status" className="flex max-w-[calc(100vw-3rem)] justify-end">
        {message && (
          <p className="flex items-center gap-3 rounded-full border border-border bg-background/70 px-4 py-1.5 text-sm text-foreground backdrop-blur">
            <span className="min-w-0 truncate">{message}</span>
            {changed && status.kind === "done" && (
              <button type="button" onClick={reset} className="shrink-0 cursor-pointer font-semibold text-accent underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-foreground">
                {t("moodReset")}
              </button>
            )}
          </p>
        )}
      </div>
      <form
        onSubmit={submit}
        onKeyDown={onKeyDown}
        className="flex h-11 items-center gap-1 rounded-full border border-border bg-background/70 p-1 backdrop-blur focus-within:border-accent"
      >
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="wave-mood-input"
          aria-label={open ? t("moodClose") : undefined}
          className={`${buttonClass} ${open ? "w-9" : "gap-2 px-3 text-sm font-semibold"}`}
        >
          {open ? (
            <CloseIcon />
          ) : (
            <>
              <WaveIcon />
              {t("moodOpen")}
            </>
          )}
        </button>
        {open && (
          <>
            <input
              ref={inputRef}
              id="wave-mood-input"
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={MAX_LENGTH}
              placeholder={t("moodPlaceholder")}
              aria-label={t("moodInputLabel")}
              autoComplete="off"
              className="h-9 w-[min(15rem,calc(100vw-9.5rem))] bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted sm:w-64"
            />
            <button
              type="submit"
              disabled={!text.trim() || thinking || cooling}
              aria-label={t("moodSend")}
              className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </>
        )}
      </form>
    </div>
  );
}
