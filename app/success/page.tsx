'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { app } from '@/lib/firebase'

export default function SuccessPage() {
  const router = useRouter()
  const [done, setDone] = useState(false)

  useEffect(() => {
    const saveProStatus = async () => {
      const auth = getAuth(app)
      const user = auth.currentUser

      if (!user) return

      const db = getFirestore(app)
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, { isPro: true }, { merge: true })

      setDone(true)
    }

    saveProStatus()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-2">✅ Payment Successful!</h1>
      {done ? (
        <p className="text-green-600 mb-4">Your Pro access is now active.</p>
      ) : (
        <p className="text-gray-600 mb-4">Processing...</p>
      )}

      <button
        onClick={() => router.push('/')}
        className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Go to Home
      </button>
    </div>
  )
}
