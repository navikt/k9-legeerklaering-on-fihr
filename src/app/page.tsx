"use client";

import "@navikt/ds-css";
import { GuidePanel, Loader, Skeleton } from '@navikt/ds-react';
import Header from '@/app/components/Header';
import React, { useContext } from 'react';
import { FHIRContext, FhirContextProvider } from "./context/FHIRContext";
import Legeerklaering from '@/app/components/Legeerklaering';


export default function Home() {
    const {client} = useContext(FHIRContext);
    return (
        <div>
            <Header/>
            <div className="flex flex-col items-center">
                {client !== undefined && (
                    <>
                        <GuidePanel className="m-12">
                            Her kan du registrere digitalt legeerklæring for pleiepenger sykt barn.
                        </GuidePanel>
                        <Legeerklaering/>
                    </>
                )}
                {client === undefined && (
                    <div className="grid w-full gap-2 h-full">
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="circle" width={60} height={60} />
                        <Skeleton variant="rectangle" width="100%" height={30} />
                        <Skeleton variant="rounded" width="100%" height={40} />
                    </div>
                )}
            </div>
        </div>
    )
}
