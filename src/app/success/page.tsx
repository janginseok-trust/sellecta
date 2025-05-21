'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [copied, setCopied] = useState(false);

  const link = typeof window !== 'undefined' ? `${window.location.origin}/vote/${id}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!id) return <p>잘못된 접근입니다.</p>;

  return (
    <div className="max-w-xl mx-auto mt-20 px-4 text-center">
      <h1 className="text-xl font-bold mb-4">✅ 투표 생성 완료!</h1>
      <p className="mb-2 text-sm text-gray-600">아래 링크를 복사해서 공유하세요:</p>
      <div className="border p-3 rounded bg-gray-50 text-sm break-all">{link}</div>
      <button
        onClick={handleCopy}
        className="mt-4 bg-black text-white px-4 py-2 rounded hover:opacity-90"
      >
        {copied ? '✅ 복사됨!' : '링크 복사'}
      </button>
    </div>
  );
}
