
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/app/components/Header';
import NextAuthSessionProvider from '@/app/providers/sessionProvider';

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  )
}
