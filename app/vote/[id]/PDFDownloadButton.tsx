'use client'

import html2pdf from 'html2pdf.js'
import { useIsPro } from '../../hooks/useIsPro' // ✅ 상대경로로 확정 수정
import { useRouter } from 'next/navigation'

export default function PDFDownloadButton() {
  const isPro = useIsPro()
  const router = useRouter()

  const handleDownload = () => {
    const element = document.getElementById('vote-result')
    if (!element) return

    html2pdf()
      .set({
        margin: 1,
        filename: 'vote_result.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save()
  }

  if (!isPro) {
    return (
      <button
        onClick={() => router.push('/pay')}
        className="mt-6 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
      >
        🔒 Pro Only – Upgrade to Save as PDF
      </button>
    )
  }

  return (
    <button
      onClick={handleDownload}
      className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
    >
      📄 Download as PDF
    </button>
  )
}
