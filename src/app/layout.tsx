import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXX');
            `,
          }}
        />
      </head>
      <body>
        <nav className="flex gap-4 p-4 border-b text-sm font-medium">
          <Link href="/create">투표 생성</Link>
          <Link href="/my-votes">내 투표</Link>
        </nav>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
