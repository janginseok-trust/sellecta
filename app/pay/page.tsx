'use client'

import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PayPage() {
  const handlePay = async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
    })
    const data = await res.json()
    const stripe = await stripePromise
    await stripe?.redirectToCheckout({ sessionId: data.id })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">📄 Pro로 업그레이드하고 PDF 저장하기</h1>
      <button
        onClick={handlePay}
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        결제하기 ($4.99)
      </button>
    </div>
  )
}
