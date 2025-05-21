// src/app/api/create-vote/route.ts

import { NextResponse } from 'next/server';

let votes: Record<
  string,
  {
    title: string;
    options: string[];
    results: number[];
    createdAt: number;
  }
> = {};

export async function POST(req: Request) {
  const { title, options } = await req.json();

  const id = Math.random().toString(36).substring(2, 10);
  votes[id] = {
    title,
    options,
    results: Array(options.length).fill(0),
    createdAt: Date.now(),
  };

  return NextResponse.json({ id });
}

// ⚠️ 서버 재시작 시 votes 초기화됨 – 추후 DB 또는 Firestore로 교체 예정
