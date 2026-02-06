import { NextResponse } from "next/server";
import { AVAILABLE_MODELS } from "@/shared/config/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ models: AVAILABLE_MODELS });
}
