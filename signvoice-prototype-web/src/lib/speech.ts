export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  u.pitch = 1;
  u.lang = "en-IN";
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

export type SpeechHandle = {
  stop: () => void;
};

export function listen(
  onResult: (text: string, isFinal: boolean) => void,
  onError?: (message: string) => void,
): SpeechHandle {
  const SR =
    typeof window !== "undefined"
      ? ((window as unknown as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition ??
        (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition })
          .webkitSpeechRecognition)
      : undefined;

  if (!SR) {
    throw new Error("Speech recognition is not supported in this browser.");
  }

  const rec = new SR();
  rec.lang = "en-IN";
  rec.interimResults = true;
  rec.continuous = false;
  rec.onresult = (ev: SpeechRecognitionEvent) => {
    const last = ev.results[ev.results.length - 1];
    const text = last?.[0]?.transcript ?? "";
    onResult(text, Boolean(last?.isFinal));
  };
  rec.onerror = (ev: SpeechRecognitionErrorEvent) => {
    onError?.(ev.error || "Speech recognition failed.");
  };
  rec.start();
  return {
    stop: () => {
      try {
        rec.stop();
      } catch {
        // The recognition session may already have ended.
      }
    },
  };
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  results: { length: number; [i: number]: { isFinal: boolean; 0: { transcript: string } } };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}
