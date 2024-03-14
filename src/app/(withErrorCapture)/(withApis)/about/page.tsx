'use client'
import PaddedPanel from "@/app/(withErrorCapture)/(withApis)/alt/portalpoc/PaddedPanel";
import { BodyShort, Heading } from "@navikt/ds-react";
import NavNextLink from "@/app/components/NavNextLink";
import CenterColumn from "@/app/components/CenterColumn";
import React, { useContext } from "react";
import TopBar from "@/app/components/topbar/TopBar";
import FhirApiContext from "@/app/(withErrorCapture)/(withApis)/FhirApiContext";
import { BaseApiContext } from "@/app/(withErrorCapture)/(withApis)/BaseApi";
import { isIniting } from "@/app/hooks/useAsyncInit";
import FeedbackEmail from "@/app/components/feedback/FeedbackEmail";

export default function Page() {
    const fhirApi = useContext(FhirApiContext)
    const baseApi = useContext(BaseApiContext)
    return <>
        <TopBar
            user={baseApi.initData?.practitioner}
            loading={baseApi.loading !== false || isIniting(fhirApi)}
            reload={async  () => await baseApi.refreshInitData()}
        />
        <CenterColumn>
            <PaddedPanel>
                <Heading spacing level="2" size="medium">Introduksjon</Heading>
                <BodyShort >
                    Dette skjermbildet blir levert av NAV, integrert inn i ditt journalsystem.
                </BodyShort>
                <BodyShort>
                    Dette er foreløpig et pilotprosjekt, som vi håper vil bli videreutviklet og nyttig for deg som ansatt i spesialisthelsetjenesten.
                </BodyShort>
                <BodyShort>
                    Målet er å gjøre det lettere for alle parter å oppfylle behov for registrering av helseopplysninger inn
                    til NAV i forbindelse med søknader om pengestøtte fra NAV.
                </BodyShort>
                <BodyShort>
                    I denne første utviklingsfase fokuserer vi på å lage en løsning for registrering av <a target="_blank" href="https://www.nav.no/samarbeidspartner/pleiepenger-barn"><i>legeerklæring - pleiepenger sykt barn </i></a>.
                </BodyShort>
            </PaddedPanel>
            <PaddedPanel>
                <Heading spacing level="2" size="medium">Virkemåte</Heading>
                <BodyShort>
                    Når du bruker denne løsningen henter vi automatisk mest mulig nødvendig informasjon fra journalsystemet,
                    slik at du slipper å fylle ut informasjon som allerede er registrert der.
                </BodyShort>
                <BodyShort>
                    Din innlogging i journalsystemet styrer hvilken informasjon som kan hentes derifra.
                </BodyShort>
                <BodyShort>
                    Din journalsystem bruker blir også brukt til å identifisere deg som helsepersonell ovenfor NAV når du
                    lagrer/sender informasjon til oss gjennom denne løsningen. Det vil da være HPR nummeret knyttet til din
                    journalsystem-bruker som blir brukt til dette, og attributter knyttet til din bruker brukes for å avgjøre
                    om du er autorisert til å gjøre dette, og hvilket sykehus du representerer.
                </BodyShort>
                <BodyShort>
                    Kontroller derfor at kontekst informasjonen på startsiden er korrekt for din bruker. Hvis noe er feil bør du
                    rette dette i journalsystemet, og trykke oppfrisk knappen, eller lukke/gjenåpne vinduet før du
                    fortsetter.
                </BodyShort>
            </PaddedPanel>
            <PaddedPanel>
                <Heading spacing level="2" size="medium">Tilbakemelding</Heading>
                <BodyShort>
                    Hvis du opplever at noe ikke fungerer som det bør, eller har spørsmål, ta kontakt med <FeedbackEmail />
                </BodyShort>
            </PaddedPanel>
            <PaddedPanel>
                <BodyShort>
                    <NavNextLink href="/">Tilbake til startsiden</NavNextLink>
                </BodyShort>
            </PaddedPanel>
        </CenterColumn>
    </>
}