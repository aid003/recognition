import type { Message } from "./types";
import { readJSON, writeJSON } from "@/shared/lib/storage";

const STORAGE_KEY = "voice_chat_messages_v1";

export function loadMessages(): Message[] {
  return readJSON<Message[]>(STORAGE_KEY, []);
}

export function saveMessages(messages: Message[]): void {
  writeJSON(STORAGE_KEY, messages);
}
