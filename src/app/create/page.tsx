'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateVotePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async () => {
    const filteredOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!title.trim() || filteredOptions.length < 2) {
      alert('제목과 최소 2개 이상의 항목을 입력하세요.');
      return;
    }

    const res = await fetch('/api/create-vote', {
      method: 'POST',
      body: JSON.stringify({ title, options: filteredOptions }),
    });

    const data = await res.json();

    // ✅ 로컬스토리지 저장
    const saved = localStorage.getItem('myVotes');
    const arr = saved ? JSON.parse(saved) : [];
    arr.push(data.id);
    localStorage.setItem('myVotes', JSON.stringify(arr));

    router.push(`/success?id=${data.id}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-xl font-bold mb-4">✍️ 투표 만들기</h1>

      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="투표 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {options.map((opt, idx) => (
        <input
          key={idx}
          className="w-full border p-2 rounded mt-2"
          placeholder={`항목 ${idx + 1}`}
          value={opt}
          onChange={(e) => handleOptionChange(idx, e.target.value)}
        />
      ))}

      <button
        onClick={handleAddOption}
        className="text-blue-600 text-sm mt-1"
      >
        + 항목 추가
      </button>

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2 rounded hover:opacity-90 mt-4"
      >
        투표 만들기
      </button>
    </div>
  );
}
