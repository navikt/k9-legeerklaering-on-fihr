import './globals.css'
import { Inter } from 'next/font/google'
import { FhirContextProvider } from '@/app/context/FHIRContext';

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
    <FhirContextProvider>
        <body className={inter.className}>{children}</body>
    </FhirContextProvider>
    </html>
  )
}
