"use client"

import { useEffect, useState } from "react"

export function useIsPro() {
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/check-pro")
        const data = await res.json()
        setIsPro(data.isPro)
      } catch {
        setIsPro(false)
      }
    }

    check()
  }, [])

  return isPro
}
