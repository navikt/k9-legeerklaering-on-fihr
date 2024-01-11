'use client';

import "@navikt/ds-css";
import React, { useCallback, useContext, useEffect, useState } from 'react';
import LegeerklaeringPage from "@/app/components/legeerklaering/LegeerklaeringPage";
import FhirApiContext from "@/app/(withApis)/FhirApiContext";
import LegeerklaeringOppsummering from '@/app/components/legeerklaering/LegeerklaeringOppsummering';
import { isInited, isInitError, isIniting } from '@/app/hooks/useAsyncInit';
import ensureError from '@/utils/ensureError';
import { EhrInfoLegeerklaeringForm } from '@/app/components/legeerklaering/LegeerklaeringForm';
import LoadingIndicator from '@/app/components/legeerklaering/LoadingIndicator';
import ErrorDisplay from '@/app/components/legeerklaering/ErrorDisplay';
import { Alert, BodyShort, Box, Heading, HStack, VStack } from '@navikt/ds-react';
import TopBar from '@/app/(withApis)/alt/portalpoc/TopBar';
import { BaseApi, useBaseApi } from '@/app/(withApis)/alt/portalpoc/BaseApi';
import LegeerklaeringDokument from "@/models/LegeerklaeringDokument";
import { mapTilPSBLegeerklæringInnsending } from "@/app/api/oppsummering/mapper/mapper";
import SelfApiContext from "@/app/(withApis)/SelfApiContext";

export const dynamic = 'force-dynamic'

export interface PageState extends EhrInfoLegeerklaeringForm {
    readonly loading: boolean;
    readonly error: Error | null;
}

export default function Home() {
    const fhirApi = useContext(FhirApiContext)
    const helseOpplysningerApi = useContext(SelfApiContext)
    const baseApi: BaseApi = useBaseApi(fhirApi)

    const [formData, setFormData] = useState<LegeerklaeringDokument | undefined>()
    const [visOppsummering, setVisOppsummering] = useState<boolean>(false)
    const [pdf, setPdf] = useState<Blob | undefined>(undefined)
    const [dokumentOpprettet, setDokumentOpprettet] = useState<boolean>(false)

    const hentPdfOppsummering = async (submittedData: LegeerklaeringDokument) => {
        console.log("Henter pdf oppsummering")
        const pdfBlob = await helseOpplysningerApi.generatePdf(mapTilPSBLegeerklæringInnsending(submittedData))
        setPdf(pdfBlob)
    };

    const skjulOppsummering = () => {
        setVisOppsummering(false)
        setFormData(undefined)
        setPdf(undefined)
    }

    const handleJournalføring = async () => {
        console.log("Journalfører");
        if (isInited(fhirApi)) {
            console.log("FhirApi er inited");
            await fhirApi.createDocument(state.patient?.ehrId!!, state.doctor?.practitionerRoleId!!, state.hospital?.ehrId!!, formData?.dokumentReferanse!!, pdf!!)
            setDokumentOpprettet(true)

        } else if (isInitError(fhirApi)) {
            onError(fhirApi.initError)
        }
    };

    const handleFormSubmit = (submittedData: LegeerklaeringDokument) => {
        setFormData(submittedData)
        hentPdfOppsummering(submittedData)
        setVisOppsummering(true)
    }

    const [state, setState] = useState<PageState>({
        loading: true,
        error: null,
        doctor: undefined,
        patient: undefined,
        hospital: undefined,
        onFormSubmit: handleFormSubmit,
    })

    const onError = useCallback((error: Error) => setState(state => ({...state, error})), [setState])

    useEffect(() => {
        if (isInited(fhirApi)) {
            const fetchFun = async () => {
                try {
                    const {patient, practitioner: doctor, hospital} = await fhirApi.getInitState()

                    setState(state => ({
                        loading: state.loading,
                        doctor,
                        patient,
                        hospital,
                        error: null,
                        onFormSubmit: state.onFormSubmit,
                    }))
                } catch (e) {
                    onError(ensureError(e))
                } finally {
                    setState(state => ({...state, loading: false}))
                }
            }
            fetchFun()
        } else if (isInitError(fhirApi)) {
            onError(fhirApi.initError)
        }
    }, [fhirApi, onError])

    return <VStack>
        <TopBar loading={baseApi.loading} refreshInitData={baseApi.refreshInitData}
                user={baseApi.initData?.practitioner}/>
            <Box className="flex justify-center" padding={{ xs: "2", md: "6" }}>
                <VStack gap="2">

                    {dokumentOpprettet && (
                        <>
                            <Alert variant="success">
                                <Heading size="small">Legeerklæringen er sendt til NAV</Heading>
                                <BodyShort size="small">Innsendte legeerklæringer er tilgjengelig i dokumentarkivet i
                                    DIPS.</BodyShort>
                                <br/>
                                <BodyShort size="small">Du kan nå lukke denne fanen.</BodyShort>

                            </Alert>
                        </>
                    )}

                    {!dokumentOpprettet && (
                        <HStack align="center" justify="start">
                            {state.error ? (
                                <ErrorDisplay heading="Feil ved lasting av EHR info" error={state.error}/>
                            ) : state.loading ? (
                                <LoadingIndicator txt={isIniting(fhirApi) ? "Kobler til systemtjenester" : undefined}/>
                            ) : visOppsummering && formData && pdf ? (
                                <div>
                                    <LegeerklaeringOppsummering
                                        data={formData}
                                        pdf={pdf}
                                        handleJournalfør={handleJournalføring}
                                        handleSkjulOppsummering={skjulOppsummering}
                                    />
                                </div>
                            ) : (
                                <LegeerklaeringPage
                                    data={state}
                                    handleFormSubmit={handleFormSubmit}/>
                            )}
                        </HStack>
                    )}
                </VStack>
            </Box>
    </VStack>
}
