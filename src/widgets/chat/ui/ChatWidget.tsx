"use client";

import { useEffect, useState } from "react";
import { Button, Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import ChatHistory from "@/widgets/chat/ui/ChatHistory";
import ModelSelect from "@/features/model-select/ui/ModelSelect";
import VoiceRecorder from "@/features/voice-input/ui/VoiceRecorder";
import type { Message } from "@/entities/message/model/types";
import { loadMessages, saveMessages } from "@/entities/message/model/storage";
import { createId } from "@/shared/lib/id";

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMessages(loadMessages());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    saveMessages(messages);
  }, [hydrated, messages]);

  const handleTranscribed = (payload: { text: string; model: string }) => {
    const next: Message = {
      id: createId(),
      text: payload.text,
      model: payload.model,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [next, ...prev]);
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <Stack gap={6}>
          <Title order={1}>Голосовой разговорник</Title>
          <Text c="dimmed">
            Записывайте фразы голосом, а мы сохраним их в истории.
          </Text>
        </Stack>

        <Card withBorder radius="lg" p="lg">
          <Stack gap="md">
            <ModelSelect value={model} onChange={setModel} />
            <VoiceRecorder model={model} onTranscribed={handleTranscribed} />
          </Stack>
        </Card>

        <Group justify="space-between" align="center">
          <Title order={3}>История сообщений</Title>
          <Button
            variant="light"
            color="gray"
            onClick={handleClear}
            disabled={messages.length === 0}
          >
            Очистить
          </Button>
        </Group>

        <ChatHistory messages={messages} />
      </Stack>
    </Container>
  );
}
