"use client";

import "@navikt/ds-css";
import { GuidePanel } from '@navikt/ds-react';
import Header from '@/app/components/Header';
import { useSession } from 'next-auth/react';

export default function Home() {
    const {data: session, status} = useSession()

    return (
        <div>
            <Header/>
            {!session?.user && (
                <GuidePanel className="m-12">
                    Her kan du registrere digitalt legeerklæring for pleiepenger sykt barn.
                </GuidePanel>
            )}
        </div>
    )
}
