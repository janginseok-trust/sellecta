"use client";

import { useEffect, useState } from "react";

type VoteData = {
  title: string;
  options: string[];
  results: number[];
  createdAt: number;
};

function getRemainingTime(createdAt: number): string {
  const now = Date.now();
  const expires = createdAt + 720 * 60 * 60 * 1000;
  const diff = expires - now;

  if (diff <= 0) return "만료됨";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const restHours = hours % 24;

  return `${days}일 ${restHours}시간`;
}

export default function VotePage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<VoteData | null>(null);
  const [voted, setVoted] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    fetch(`/api/vote/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        const now = Date.now();
        const expires = data.createdAt + 720 * 60 * 60 * 1000;
        if (now > expires) setExpired(true);
      });

    const votedIds = JSON.parse(localStorage.getItem("voted") || "[]");
    setVoted(votedIds.includes(params.id));
  }, [params.id]);

  function handleVote(idx: number) {
    fetch(`/api/vote/${params.id}`, {
      method: "POST",
      body: JSON.stringify(idx),
    }).then(() => {
      const votedIds = JSON.parse(localStorage.getItem("voted") || "[]");
      votedIds.push(params.id);
      localStorage.setItem("voted", JSON.stringify(votedIds));
      setVoted(true);

      setData((prev) =>
        prev
          ? {
              ...prev,
              results: prev.results.map((n, i) => (i === idx ? n + 1 : n)),
            }
          : prev
      );
    });
  }

  if (!data) return <p>불러오는 중...</p>;
  if (expired)
    return (
      <div className="max-w-xl mx-auto text-center mt-10">
        <h2 className="text-lg font-semibold text-red-600">
          ⛔ 이 투표는 만료되어 열람할 수 없습니다
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          투표는 생성 후 30일(720시간)이 지나면 자동 만료됩니다.
        </p>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">{data.title}</h1>

      <p className="text-sm text-gray-500">
        남은 시간: {getRemainingTime(data.createdAt)}
      </p>

      {Date.now() > data.createdAt + 648 * 60 * 60 * 1000 && (
        <p className="text-red-600 text-sm">⚠️ 곧 삭제됩니다</p>
      )}

      {!voted && (
        <p className="text-sm text-gray-500">
          📊 투표 후 결과를 확인할 수 있습니다.
        </p>
      )}

      <div className="mt-4 space-y-2">
        {data.options.map((opt, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border p-2 rounded"
          >
            <span>{opt}</span>
            {voted ? (
              <span className="text-sm text-gray-600">
                {data.results[idx]}표
              </span>
            ) : (
              <button
                className="text-blue-600 text-sm"
                onClick={() => handleVote(idx)}
              >
                투표
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
