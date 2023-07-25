import './globals.css'
import { Inter } from 'next/font/google'
import {Metadata} from "next";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    robots: "noindex, nofollow", // This is not a website meant for public use, so don't want any indexing
    title: "NAV legeerklæring sykt barn"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="no">
      <body className={inter.className}>{children}</body>
      </html>
  )
}
