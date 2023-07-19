"use client";

import "@navikt/ds-css";
import { Alert, ExpansionCard, Heading, Skeleton } from '@navikt/ds-react';
import Header from '@/app/components/Header';
import React, { useContext } from 'react';
import { FHIRContext } from "./context/FHIRContext";
import Legeerklaering from '@/app/components/legeerklaering/Legeerklaering';
import { StethoscopeIcon } from '@navikt/aksel-icons';


export default function Home() {
    const {loading, error, practitioner} = useContext(FHIRContext);
    return (
        <div>
            <Header practitioner={practitioner}/>
            <div className="mx-auto mt-16 max-w-4xl p-4 pb-32">
                {error && (
                    <Alert variant="error">
                        Ops!! Noe gikk galg<br/>
                        {error.name}: {error.message}
                    </Alert>
                )}

                <Heading level="1" size="xlarge">Legeerklæring - pleiepenger sykt barn</Heading>

                <ExpansionCard aria-label="om-legeerklæringen" className="mt-8 mb-8">
                    <ExpansionCard.Header>
                        <div className="flex items-center space-x-4">
                            <div className="text-6xl flex-shrink-0 grid place-content-center">
                                <StethoscopeIcon aria-hidden/>
                            </div>
                            <div>
                                <ExpansionCard.Title>Om legeerklæringen</ExpansionCard.Title>
                            </div>
                        </div>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <p>Legeerklæringen skal fylles ut av behandlende lege. Det er kun sykehusleger og leger
                            i
                            spesialisthelsetjenesten som kan skrive legeerklæring for pleiepenger for sykt
                            barn.</p>
                        <br/>

                        <p>NAV trenger tidsnære opplysninger for å behandle søknad om pleiepenger. Det innebærer
                            at
                            NAV trenger oppdaterte medisinske opplysninger for åvurdere om vilkårene for rett
                            til
                            pleiepenger er oppfylt. </p><br/>
                    </ExpansionCard.Content>
                </ExpansionCard>

                {!error && !loading && (
                    <>
                        <Legeerklaering/>
                    </>
                )}

                {loading && (
                    <div className="grid w-full gap-2 h-full">
                        <Skeleton variant="text" width="60%"/>
                        <Skeleton variant="circle" width={60} height={60}/>
                        <Skeleton variant="rectangle" width="100%" height={30}/>
                        <Skeleton variant="rounded" width="100%" height={40}/>
                    </div>
                )}
            </div>
        </div>
    )
}
