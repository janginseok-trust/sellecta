'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  doc,
  getDoc,
  setDoc,
  getFirestore,
  collection,
  getDocs,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { formatDistanceToNowStrict } from 'date-fns'
import { app } from '@/lib/firebase'
import PDFDownloadButton from './PDFDownloadButton'

export default function VotePage() {
  const { id } = useParams()
  const [voteData, setVoteData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [votedOption, setVotedOption] = useState<string | null>(null)
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [remaining, setRemaining] = useState('')
  const [hoursLeft, setHoursLeft] = useState<number | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchVote = async () => {
      const db = getFirestore(app)
      const docRef = doc(db, 'votes', id as string)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        const expiresAt = data.expiresAt.toDate().toISOString()
        setVoteData({ ...data, expiresAt })
      }

      setLoading(false)
    }

    fetchVote()
  }, [id])

  useEffect(() => {
    if (!voteData?.expiresAt) return

    const updateRemaining = () => {
      const expiresDate = new Date(voteData.expiresAt)
      const now = new Date()

      const dist = formatDistanceToNowStrict(expiresDate, { addSuffix: false })
      setRemaining(dist)

      const hours = Math.floor((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60))
      setHoursLeft(hours)
    }

    updateRemaining()
    const interval = setInterval(updateRemaining, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [voteData])

  useEffect(() => {
    const checkIfVoted = async () => {
      const auth = getAuth(app)
      const user = auth.currentUser
      if (!user) return

      const db = getFirestore(app)
      const resultRef = doc(db, 'votes', id as string, 'results', user.uid)
      const resultSnap = await getDoc(resultRef)
      if (resultSnap.exists()) {
        setVotedOption(resultSnap.data().option)
        setAlreadyVoted(true)
      }
    }

    checkIfVoted()
  }, [id])

  useEffect(() => {
    const fetchCounts = async () => {
      const db = getFirestore(app)
      const resultsRef = collection(db, 'votes', id as string, 'results')
      const snapshot = await getDocs(resultsRef)

      const tempCounts: Record<string, number> = {}
      snapshot.forEach((doc) => {
        const vote = doc.data()
        if (!vote.option) return
        tempCounts[vote.option] = (tempCounts[vote.option] || 0) + 1
      })

      setCounts(tempCounts)
    }

    fetchCounts()
  }, [id, votedOption])

  const handleVote = async (option: string) => {
    if (alreadyVoted) return
    const auth = getAuth(app)
    const user = auth.currentUser
    if (!user) {
      alert('Please sign in to vote.')
      return
    }

    const db = getFirestore(app)
    const resultRef = doc(db, 'votes', id as string, 'results', user.uid)
    await setDoc(resultRef, {
      uid: user.uid,
      option,
      votedAt: new Date(),
    })

    setVotedOption(option)
    setAlreadyVoted(true)
  }

  if (loading) return <div>Loading...</div>
  if (!voteData) return <div>Vote not found.</div>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{voteData.title}</h1>

      {remaining && hoursLeft !== null && (
        <div className="mt-2 text-sm text-red-600 font-medium">
          🕒 This vote will be deleted in <strong>{remaining}</strong>.
          {hoursLeft <= 72 ? (
            <p className="text-red-700 mt-1">⚠️ Expiring soon. Save it as PDF now!</p>
          ) : (
            <p className="text-gray-600 mt-1">💾 You may want to save it as a PDF.</p>
          )}
        </div>
      )}

      <div id="vote-result" className="bg-white p-4 mt-6 border rounded shadow">
        <ul className="space-y-2">
          {voteData.options.map((opt: string, idx: number) => (
            <li
              key={idx}
              onClick={() => handleVote(opt)}
              className={`cursor-pointer border px-3 py-2 rounded transition flex justify-between items-center ${
                votedOption === opt
                  ? 'bg-green-100 border-green-600 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span>{opt}</span>
              {counts[opt] !== undefined && (
                <span className="text-sm text-gray-500">
                  {counts[opt]} vote{counts[opt] !== 1 ? 's' : ''}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {votedOption && (
        <div className="mt-4 text-green-700 font-medium">
          ✅ You voted for: <strong>{votedOption}</strong>
        </div>
      )}

      <PDFDownloadButton />
    </div>
  )
}
