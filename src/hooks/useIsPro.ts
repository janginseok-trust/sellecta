'use client'

import { useEffect, useState } from 'react'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { app } from '@/lib/firebase' // Firebase 초기화된 app

export function useIsPro() {
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    const checkPro = async () => {
      const auth = getAuth(app)
      const user = auth.currentUser
      if (!user) return

      const db = getFirestore(app)
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      const data = docSnap.data()
      setIsPro(data?.isPro === true)
    }

    checkPro()
  }, [])

  return isPro
}
