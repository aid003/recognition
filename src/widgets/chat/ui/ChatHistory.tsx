"use client";

import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import type { Message } from "@/entities/message/model/types";
import { formatDateTime } from "@/shared/lib/time";

type ChatHistoryProps = {
  messages: Message[];
};

export default function ChatHistory({ messages }: ChatHistoryProps) {
  if (messages.length === 0) {
    return (
      <Card withBorder radius="md" p="lg">
        <Stack gap={4}>
          <Text fw={600}>История пуста</Text>
          <Text size="sm" c="dimmed">
            Запишите первое сообщение — оно появится здесь.
          </Text>
        </Stack>
      </Card>
    );
  }

  const ordered = [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <Stack gap="sm">
      {ordered.map((message) => (
        <Card key={message.id} withBorder radius="md" p="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text size="sm" c="dimmed">
              {formatDateTime(message.createdAt)}
            </Text>
            <Badge variant="light" color="violet">
              {message.model}
            </Badge>
          </Group>
          <Text>{message.text || "(пустая транскрипция)"}</Text>
        </Card>
      ))}
    </Stack>
  );
}
