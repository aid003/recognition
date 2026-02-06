import { useCallback, useRef, useState } from "react";

type RecorderStatus = "idle" | "recording";

export type RecorderResult = {
  blob: Blob;
  mimeType: string;
};

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/ogg",
  "audio/wav"
];

const getSupportedMimeType = () => {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
};

export function useRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>("audio/webm");
  const timerRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const start = useCallback(async () => {
    if (status === "recording") {
      return;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setError("Браузер не поддерживает запись аудио");
      return;
    }

    try {
      setError(null);
      setDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      if (mimeType) {
        mimeTypeRef.current = mimeType;
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener("error", () => {
        setError("Произошла ошибка при записи");
      });

      recorder.start();
      setStatus("recording");

      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError("Не удалось получить доступ к микрофону");
      cleanup();
      setStatus("idle");
    }
  }, [cleanup, status]);

  const stop = useCallback(() => {
    return new Promise<RecorderResult>((resolve, reject) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state !== "recording") {
        reject(new Error("Запись не активна"));
        return;
      }

      const finalize = () => {
        const mimeType = recorder.mimeType || mimeTypeRef.current;
        const blob = new Blob(chunksRef.current, { type: mimeType });
        cleanup();
        setStatus("idle");
        resolve({ blob, mimeType });
      };

      recorder.addEventListener("stop", finalize, { once: true });
      recorder.stop();
    });
  }, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setDuration(0);
    setStatus("idle");
  }, [cleanup]);

  return {
    status,
    duration,
    error,
    start,
    stop,
    reset,
    mimeType: mimeTypeRef.current
  };
}
