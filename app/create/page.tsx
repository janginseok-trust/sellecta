'use client'

import { useState } from 'react'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { app } from '@/lib/firebase'

export default function CreatePage() {
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addOption = () => {
    if (options.length < 5) setOptions([...options, ''])
  }

  const handleChangeOption = (value: string, index: number) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async () => {
    if (!title.trim() || options.some(opt => !opt.trim())) return

    setLoading(true)
    const db = getFirestore(app)
    const docRef = await addDoc(collection(db, 'votes'), {
      title,
      options,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 720 * 60 * 60 * 1000)),
    })

    router.push(`/vote/${docRef.id}`)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Create a New Vote</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
        placeholder="Enter vote title"
      />

      {options.map((opt, idx) => (
        <input
          key={idx}
          value={opt}
          onChange={(e) => handleChangeOption(e.target.value, idx)}
          className="w-full border px-3 py-2 mb-2 rounded"
          placeholder={`Option ${idx + 1}`}
        />
      ))}

      {options.length < 5 && (
        <button
          onClick={addOption}
          className="text-sm text-blue-600 hover:underline mb-4"
        >
          ➕ Add Option
        </button>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        {loading ? 'Creating...' : 'Create Vote'}
      </button>
    </div>
  )
}
