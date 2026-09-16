import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children } : {children: React.ReactNode;}) {
  return (
    <html lang="ja">
      <body>
        <header className="bg-black text-white px-8 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-lg">BLOG</Link>
          <Link href="/contact">お問い合わせ</Link>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}