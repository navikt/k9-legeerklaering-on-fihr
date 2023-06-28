import type { ReactNode } from "react"
import Header from '@/app/components/Header';
import { useSession } from 'next-auth/react';

export default function Layout({children}: { children: ReactNode }) {
    const {data: session, status} = useSession()
    const loading = status === "loading"

    return (
        <>
            <Header/>
            {/* TODO: Fjern ! i !session?.user når innlogging virker */}
            {!session?.user && (
                <main>{children}</main>
            )}
        </>
    )
}
