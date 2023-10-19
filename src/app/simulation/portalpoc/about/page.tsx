'use client';

import React from "react";

import { BodyShort, Heading } from "@navikt/ds-react";
import CenterColumn from "@/app/simulation/portalpoc/CenterColumn";
import PaddedPanel from "@/app/simulation/portalpoc/PaddedPanel";
import NavNextLinkPanel from "@/app/components/NavNextLinkPanel";
import NavNextLink from "@/app/components/NavNextLink";

const Page = () => {
    return (
        <CenterColumn>
            <PaddedPanel>
                <Heading spacing level="2" size="medium">Introduksjon</Heading>
                <BodyShort >
                    Dette skjermbildet blir levert av NAV, integrert inn i ditt sykehus sitt journalsystem.
                </BodyShort>
                <BodyShort>
                    Dette er foreløpig et pilotprosjekt, som vi håper vil bli videreutviklet og nyttig for deg som sykehusansatt.
                </BodyShort>
                <BodyShort>
                    Målet er å gjøre det lettere for alle parter å oppfylle behov for registrering av helseopplysninger inn
                    til NAV i forbindelse med søknader om pengestøtte fra NAV.
                </BodyShort>
                <BodyShort>
                    I denne første utviklingsfase fokuserer vi på å lage en løsning for registrering av <i>legeerklæring - pleiepenger sykt barn </i>.
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
                <BodyShort>
                    <NavNextLink href="/simulation/portalpoc">Tilbake til startsiden</NavNextLink>
                </BodyShort>
            </PaddedPanel>
        </CenterColumn>
    )
}

export default Page;