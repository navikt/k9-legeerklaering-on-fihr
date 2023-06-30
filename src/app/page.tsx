"use client";

import "@navikt/ds-css";
import { GuidePanel, Panel } from '@navikt/ds-react';
import Header from '@/app/components/Header';
import React from 'react';
import { FhirContextProvider } from "./context/FHIRContext";
import Legeerklaering from '@/app/components/Legeerklaering';


export default function Home() {
    return (
        <FhirContextProvider>
            <Header/>
            <GuidePanel className="m-12">
                Her kan du registrere digitalt legeerklæring for pleiepenger sykt barn.
            </GuidePanel>
            <Panel border>
                <Legeerklaering/>
            </Panel>
        </FhirContextProvider>
    )
}
