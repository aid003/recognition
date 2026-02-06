export const AVAILABLE_MODELS = [
  { id: "gpt-4o-mini-transcribe", label: "GPT-4o mini Transcribe" },
  { id: "gpt-4o-transcribe", label: "GPT-4o Transcribe" },
  { id: "gpt-4o-transcribe-diarize", label: "GPT-4o Transcribe (Diarize)" },
  { id: "whisper-1", label: "Whisper-1" }
] as const;

export type ModelId = (typeof AVAILABLE_MODELS)[number]["id"];
