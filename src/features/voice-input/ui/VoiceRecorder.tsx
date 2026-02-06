"use client";

import { useState } from "react";
import { Alert, Button, Group, Loader, Stack, Text } from "@mantine/core";
import { IconMicrophone, IconPlayerStop } from "@tabler/icons-react";
import { useRecorder } from "../model/useRecorder";

const getExtension = (mimeType: string) => {
  if (mimeType.includes("ogg")) {
    return "ogg";
  }
  if (mimeType.includes("wav")) {
    return "wav";
  }
  return "webm";
};

type VoiceRecorderProps = {
  model: string | null;
  onTranscribed: (payload: { text: string; model: string }) => void;
};

export default function VoiceRecorder({ model, onTranscribed }: VoiceRecorderProps) {
  const { status, duration, error, start, stop } = useRecorder();
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleStart = async () => {
    setServerError(null);
    await start();
  };

  const handleStop = async () => {
    if (!model) {
      setServerError("Сначала выберите модель распознавания");
      return;
    }

    setServerError(null);
    setUploading(true);

    try {
      const { blob, mimeType } = await stop();
      const extension = getExtension(mimeType);
      const file = new File([blob], `recording-${Date.now()}.${extension}`, {
        type: mimeType
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", model);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData
      });

      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Ошибка распознавания речи");
      }

      onTranscribed({ text: data.text ?? "", model });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack gap="sm">
      {(error || serverError) && (
        <Alert color="red" title="Ошибка">
          {error ?? serverError}
        </Alert>
      )}

      <Group justify="space-between" align="center">
        <Stack gap={4}>
          <Text fw={600}>Запись голоса</Text>
          <Text size="sm" c="dimmed">
            {status === "recording" ? `Идет запись: ${duration} сек` : "Готово к записи"}
          </Text>
        </Stack>
        {uploading && <Loader size="sm" />}
      </Group>

      <Button
        size="lg"
        radius="md"
        color={status === "recording" ? "red" : "violet"}
        leftSection={status === "recording" ? <IconPlayerStop size={18} /> : <IconMicrophone size={18} />}
        onClick={status === "recording" ? handleStop : handleStart}
        disabled={uploading || (status !== "recording" && !model)}
      >
        {status === "recording" ? "Остановить" : "Начать запись"}
      </Button>
    </Stack>
  );
}
