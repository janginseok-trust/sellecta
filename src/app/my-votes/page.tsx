'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type StoredVote = {
  id: string;
  title: string;
  createdAt: number;
};

export default function MyVotesPage() {
  const [votes, setVotes] = useState<StoredVote[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('my-votes');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StoredVote[];
        setVotes(parsed);
      } catch (e) {
        console.error('로컬스토리지 파싱 오류', e);
      }
    }
  }, []);

  if (votes.length === 0) {
    return <p className="text-center text-gray-500">저장된 투표가 없습니다.</p>;
  }

  return (
    <div className="max-w-xl mx-auto px-4 space-y-3">
      <h1 className="text-lg font-bold mb-2">📋 내가 만든 투표</h1>
      {votes.map((vote) => (
        <Link key={vote.id} href={`/vote/${vote.id}`}>
          <div className="border p-3 rounded hover:bg-gray-100 cursor-pointer">
            <div className="text-sm text-gray-600">
              {new Date(vote.createdAt).toLocaleString()}
            </div>
            <div className="text-md font-medium">{vote.title}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
