'use client';

import React from "react";

import { BodyShort, Heading } from "@navikt/ds-react";
import CenterColumn from "@/app/simulation/portalpoc/CenterColumn";
import PaddedPanel from "@/app/simulation/portalpoc/PaddedPanel";
import NavNextLink from "@/app/components/NavNextLink";
import { ExternalLinkIcon } from "@navikt/aksel-icons";

const Page = () => {
    return (
        <CenterColumn>
            <PaddedPanel>
                <Heading spacing level="2" size="medium">Introduksjon</Heading>
                <BodyShort>
                    Tidligere har en omsorgsperson med behov for pleiepenger for å ta seg av et sykt barn
                    selv måtte sørge for å få lagt ved legeerklæring fra lege i spesialisthelsetjenesten i søknaden til NAV.
                </BodyShort>
                <BodyShort>
                    Med denne nye løsningen kan lege registrere og sende inn legeerklæring direkte til NAV,
                    slik at den kan knyttes til eksisterende eller framtidig søknad som omsorgsperson til barnet registrerer.
                </BodyShort>
                <BodyShort >
                    Ved å sende inn legeerklæring vedrørende <i>pleiepenger sykt barn</i> gjennom denne løsningen slipper
                    du altså å skrive ut eller på annen måte overlevere utfyllt legeerklæring til den/de som skal søke om
                    pleiepenger.
                </BodyShort>
                <BodyShort>
                    Legeerklæringen skal fylles ut av behandlende lege. Det er kun sykehusleger og leger i spesialisthelsetjenesten
                    som kan skrive legeerklæring for pleiepenger for sykt barn.
                </BodyShort>
                <BodyShort>
                    <NavNextLink href="https://www.nav.no/samarbeidspartner/pleiepenger-barn#legeerklering-pleiepenger" target="_blank">
                        Les mer om dette på NAVs sider for helsepersonell <ExternalLinkIcon title="Ekstern link" />
                    </NavNextLink>
                </BodyShort>
                <BodyShort>
                    Du kan også lese mer <NavNextLink href="/simulation/portalpoc/about">generell info om løsningen her</NavNextLink>
                </BodyShort>
            </PaddedPanel>
        </CenterColumn>
    )
}

export default Page;