import './globals.css'
import { Inter } from 'next/font/google'
import {Metadata} from "next";
import { Suspense } from "react";

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
    // The Suspense element below is probably not needed. Added to get rid of error "Missing Suspense boundary with useSearchParams"
    // introduced with Next versjon 14.1.0 (https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout)
    // That error was triggered by the use of useSearchParams hook in (withApis)/layout.tsx. Don't think that really was
    // an issue for this project since we have 'use-client' and 'force-dynamic' on the (withApis)/layout.tsx
  return (
      <html lang="no">
      <body className={inter.className}>
          <Suspense>
              {children}
          </Suspense>
      </body>
      </html>
  )
}
