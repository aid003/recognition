export const AVAILABLE_MODELS = [
  { id: "gpt-4o-mini-transcribe", label: "Whisper tiny" },
  { id: "gpt-4o-transcribe", label: "Whisper base" },
  { id: "gpt-4o-transcribe-diarize", label: "Whisper large-v3 (diarization)" },
  { id: "whisper-1", label: "Whisper medium" }
] as const;

export type ModelId = (typeof AVAILABLE_MODELS)[number]["id"];
