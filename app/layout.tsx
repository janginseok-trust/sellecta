export const metadata = {
  title: 'Pickly',
  description: 'Simple global voting with trust & payment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
