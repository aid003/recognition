import { NextResponse } from "next/server";
import { AVAILABLE_MODELS } from "@/shared/config/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedModels = new Set<string>(AVAILABLE_MODELS.map((model) => model.id));

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY не задан" },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Неверный формат данных" }, { status: 400 });
  }

  const file = formData.get("file");
  const model = formData.get("model");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }

  if (typeof model !== "string" || !allowedModels.has(model)) {
    return NextResponse.json({ error: "Неверная модель" }, { status: 400 });
  }

  const upstream = new FormData();
  upstream.append("file", file, file.name || "recording.webm");
  upstream.append("model", model);

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: upstream
  });

  if (!response.ok) {
    const details = await response.text();
    return NextResponse.json(
      { error: "Ошибка OpenAI", details },
      { status: response.status }
    );
  }

  const data = (await response.json()) as { text?: string };

  return NextResponse.json({ text: data.text ?? "", model });
}
