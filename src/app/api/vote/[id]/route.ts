// src/app/api/vote/[id]/route.ts
import { NextResponse } from "next/server";

// 메모리 저장소 (create-vote에서 이미 선언했다면 공유 필요)
const votes: Record<string, {
  title: string;
  options: string[];
  results: number[];
}> = globalThis.votes || (globalThis.votes = {});

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const vote = votes[params.id];
  if (!vote) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vote);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { index } = await req.json();
  const vote = votes[params.id];
  if (!vote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  vote.results[index]++;
  return NextResponse.json(vote);
}
