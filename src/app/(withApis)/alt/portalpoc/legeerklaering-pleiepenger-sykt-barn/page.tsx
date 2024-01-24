'use client'
import CenterColumn from "@/app/components/CenterColumn"
import { BodyShort, Box, Heading, HStack, Table, VStack } from "@navikt/ds-react";
import React, { useContext } from "react";
import { ArrowRightIcon, PersonIcon } from "@navikt/aksel-icons";
import PatientListing from "../PatientListing";
import NavNextLink from "@/app/components/NavNextLink";
import PaddedPanel from "../PaddedPanel";
import InitDataDependentRender from "@/app/components/InitDataDependentRender";
import NavNextLinkButton from "@/app/components/NavNextLinkButton";
import { BaseApiContext } from "@/app/(withApis)/BaseApi";

interface Statement {
    readonly sentDate: Date | undefined;
    readonly periodFrom: Date;
    readonly periodTo: Date;
}

const Page = () => {
    const api = useContext(BaseApiContext)

    const previousStatements: Statement[] = [
        {
            sentDate: new Date("2014-04-02"),
            periodFrom: new Date("2014-03-10"),
            periodTo: new Date("2014-03-29"),
        },
        {
            sentDate: new Date("2016-02-02"),
            periodFrom: new Date("2016-02-02"),
            periodTo: new Date("2016-03-16"),
        },
    ]

    const draftStatements: Statement[] = [
        {
            sentDate: undefined,
            periodFrom: new Date("2023-06-10"),
            periodTo: new Date("2023-06-29"),
        }
    ]


    return <>
        <CenterColumn>
            <PaddedPanel>
                <Heading spacing level="1" size="large">Legeerklæring - pleiepenger sykt barn</Heading>
                <BodyShort>
                    Her kan du følge opp og registrere nye legeerklæringer i forbindelse med <i>Pleiepenger sykt barn</i>.
                    Disse kan da sendes elektronisk direkte til NAV fra journalsystemet.
                </BodyShort>
                <BodyShort>
                    <NavNextLink href="/alt/portalpoc/legeerklaering-pleiepenger-sykt-barn/about">
                        Les mer om dette på denne siden
                    </NavNextLink>
                </BodyShort>
            </PaddedPanel>
            <InitDataDependentRender baseApi={api} render={(initData) =>
                <PaddedPanel>
                    <Heading spacing level="2" size="medium">Systeminfo</Heading>
                    <VStack gap="8">
                        <HStack gap="4">
                            <Box background="bg-subtle" padding="4" borderRadius="medium">
                                <PersonIcon style={{float: "left"}} aria-hidden title="Person ikon" fontSize="1.8rem" />
                                <Heading spacing level="3" size="small">Pasient</Heading>
                                <PatientListing patient={initData.patient} />
                            </Box>
                        </HStack>
                        <Box padding="4" borderRadius="medium" borderWidth="2" borderColor="border-success">
                            <Heading level="3" size="small">Tidligere innsendte denne pasient</Heading>
                            <Table size="small">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Sendt</Table.HeaderCell>
                                        <Table.HeaderCell>Pleie fra</Table.HeaderCell>
                                        <Table.HeaderCell>Pleie til</Table.HeaderCell>
                                        <Table.HeaderCell>Vis</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        previousStatements.map(({sentDate, periodFrom, periodTo}, idx) => {
                                            return (
                                                <Table.Row key={idx}>
                                                    <Table.DataCell>{sentDate?.toLocaleDateString()}</Table.DataCell>
                                                    <Table.DataCell>{periodFrom.toLocaleDateString()}</Table.DataCell>
                                                    <Table.DataCell>{periodTo.toLocaleDateString()}</Table.DataCell>
                                                    <Table.DataCell><NavNextLink href={`/alt/portalpoc/legeerklaering-pleiepenger-sykt-barn/show`}> <ArrowRightIcon title="Gå til" /></NavNextLink></Table.DataCell>
                                                </Table.Row>
                                            )
                                        })
                                    }
                                </Table.Body>
                            </Table>
                        </Box>
                        <Box padding="4" borderRadius="medium" borderWidth="2" borderColor="border-default">
                            <Heading level="3" size="small">Ikke innsendte denne pasient</Heading>
                            <Table size="small">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Sendt</Table.HeaderCell>
                                        <Table.HeaderCell>Pleie fra</Table.HeaderCell>
                                        <Table.HeaderCell>Pleie til</Table.HeaderCell>
                                        <Table.HeaderCell>Vis</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        draftStatements.map(({sentDate, periodFrom, periodTo}, idx) => {
                                            return (
                                                <Table.Row key={idx}>
                                                    <Table.DataCell>{sentDate?.toLocaleDateString()}</Table.DataCell>
                                                    <Table.DataCell>{periodFrom.toLocaleDateString()}</Table.DataCell>
                                                    <Table.DataCell>{periodTo.toLocaleDateString()}</Table.DataCell>
                                                    <Table.DataCell><NavNextLink href={`/alt/portalpoc/legeerklaering-pleiepenger-sykt-barn/show`}> <ArrowRightIcon title="Gå til" /></NavNextLink></Table.DataCell>
                                                </Table.Row>
                                            )
                                        })
                                    }
                                </Table.Body>
                            </Table>
                        </Box>
                        <Box padding="0">
                            <NavNextLinkButton href="/alt/portalpoc/legeerklaering-pleiepenger-sykt-barn/new">
                                Opprett ny legeerklæring
                            </NavNextLinkButton>
                        </Box>
                    </VStack>
                </PaddedPanel>
            } />
        </CenterColumn>
    </>
}

export default Page;