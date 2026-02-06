"use client";

import { useEffect, useState } from "react";
import { Loader, Select } from "@mantine/core";

type ModelOption = { id: string; label: string };

type ModelSelectProps = {
  value: string | null;
  onChange: (value: string) => void;
};

export default function ModelSelect({ value, onChange }: ModelSelectProps) {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadModels = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/models");
        if (!response.ok) {
          throw new Error("Не удалось загрузить список моделей");
        }
        const data = (await response.json()) as { models?: ModelOption[] };
        if (active) {
          setModels(data.models ?? []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError("Не удалось загрузить модели");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadModels();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!value && models.length > 0) {
      onChange(models[0].id);
    }
  }, [models, onChange, value]);

  return (
    <Select
      label="Модель распознавания"
      placeholder={loading ? "Загрузка..." : "Выберите модель"}
      data={models.map((model) => ({ value: model.id, label: model.label }))}
      value={value}
      onChange={(next) => {
        if (next) {
          onChange(next);
        }
      }}
      rightSection={loading ? <Loader size="xs" /> : null}
      error={error ?? undefined}
      withAsterisk
      searchable
      nothingFoundMessage="Модели не найдены"
    />
  );
}
