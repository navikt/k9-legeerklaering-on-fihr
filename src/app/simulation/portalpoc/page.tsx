'use client';

import { useContext } from "react";
import { BaseApi, BaseApiContext } from "@/app/simulation/portalpoc/BaseApi";
import { BodyShort, Heading, LinkPanel } from "@navikt/ds-react";
import CenterColumn from "@/app/simulation/portalpoc/CenterColumn";

import NavNextLink from "@/app/components/NavNextLink";
import StartStatus from "@/app/simulation/portalpoc/StartStatus";
import NavNextLinkPanel from "@/app/components/NavNextLinkPanel";
import PaddedPanel from "@/app/simulation/portalpoc/PaddedPanel";

const Page = () => {
    const api: BaseApi = useContext(BaseApiContext)

    return <>
        <CenterColumn>
            <PaddedPanel>
                <Heading spacing level="1" size="large">NAV sykehusintegrasjon startside</Heading>
                <BodyShort>
                    Dette skjermbildet blir levert av NAV, integrert inn i ditt sykehus sitt journalsystem.
                </BodyShort>
                <BodyShort>
                    <NavNextLink href="/simulation/portalpoc/about">Les mer om bakgrunn og hvordan dette virker her</NavNextLink>
                </BodyShort>
            </PaddedPanel>
            <PaddedPanel>
                <Heading spacing level="2" size="medium">Systeminfo</Heading>
                <StartStatus {...api} />
            </PaddedPanel>
            {
                api.initData !== null ?
                    <PaddedPanel>
                        <Heading spacing level="2" size="medium">Tjenester</Heading>
                        <BodyShort>
                            <NavNextLinkPanel href="/simulation/portalpoc/legeerklaering-pleiepenger-sykt-barn">
                                <LinkPanel.Title> Legeerklæring - Pleiepenger sykt barn </LinkPanel.Title>
                                <LinkPanel.Description>
                                    Når omsorgspersoner må være hjemme over lengre tid for å ta seg av syke barn.
                                </LinkPanel.Description>
                            </NavNextLinkPanel>
                        </BodyShort>
                    </PaddedPanel> : null
            }
        </CenterColumn>
    </>
}

export default Page;