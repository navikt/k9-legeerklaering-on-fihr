'use client';

import "@navikt/ds-css";
import React, { useCallback, useContext, useEffect, useState } from 'react';
import LegeerklaeringPage from "@/app/components/legeerklaering/LegeerklaeringPage";
import FhirApiContext from "@/app/(withFhirApi)/FhirApiContext";
import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';
import LegeerklaeringOppsummering from '@/app/components/legeerklaering/LegeerklaeringOppsummering';
import Header from '@/app/components/Header';
import { isInited, isInitError, isIniting } from '@/app/hooks/useAsyncInit';
import ensureError from '@/utils/ensureError';
import { EhrInfoLegeerklaeringForm } from '@/app/components/legeerklaering/LegeerklaeringForm';
import LoadingIndicator from '@/app/components/legeerklaering/LoadingIndicator';
import ErrorDisplay from '@/app/components/legeerklaering/ErrorDisplay';
import { logger } from '@navikt/next-logger';
import { Heading, HStack, VStack } from '@navikt/ds-react';

export const dynamic = 'force-dynamic'

export interface PageState extends EhrInfoLegeerklaeringForm {
    readonly loading: boolean;
    readonly error: Error | null;
}

export default function Home() {
    const fhirApi = useContext(FhirApiContext)
    const [formData, setFormData] = useState<LegeerklaeringData | undefined>()
    const [visOppsummering, setVisOppsummering] = useState<boolean>(false)
    const [pdf, setPdf] = useState<Blob | undefined>(undefined)

    const hentPdfOppsummering = (submittedData: LegeerklaeringData) => {
        console.log("Henter pdf oppsummering")
        fetch(`${window.location.origin}/api/oppsummering/pdf`, {
            method: 'POST',
            body: JSON.stringify(submittedData)
        }).then(async response => {
            if (response.ok) {
                const responseData = await response.blob()
                setPdf(responseData)
            } else {
                logger.error(await response.text(), "Error submitting form data")
            }
        }).catch(error => {
            logger.error(error, "Error submitting form data")
        });
    };

    const skjulOppsummering = () => {
        setVisOppsummering(false)
        setFormData(undefined)
        setPdf(undefined)
    }

    const handleJournalføring = () => {
        console.log("Journalfører");
    };

    const handleFormSubmit = (submittedData: LegeerklaeringData) => {
        console.log(submittedData, "Submitted data in home")
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

    return <div>
        <Header doctor={state.doctor}/>
        <div className="container mx-auto">
            <VStack gap="2" justify="center" className="w-100">
                <HStack className="mt-8" align="center" justify="start">
                    <Heading size="medium">Legeerklæring: Pleiepenger for sykt barn</Heading>
                </HStack>
                <HStack align="center" justify="center">
                    {state.error ? (
                        <ErrorDisplay heading="Feil ved lasting av EHR info" error={state.error}/>
                    ) : (
                        state.loading ? (
                            <LoadingIndicator txt={isIniting(fhirApi) ? "Kobler til systemtjenester" : undefined}/>
                        ) : (
                            visOppsummering && formData && pdf ? (
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
                            )
                        )
                    )}
                </HStack>
            </VStack>
        </div>
    </div>
}
