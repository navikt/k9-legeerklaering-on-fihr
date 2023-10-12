'use client';

import { Heading } from '@navikt/ds-react';
import "@navikt/ds-css";
import Header from '@/app/components/Header';
import React, { useCallback, useEffect, useState } from 'react';
import LegeerklaeringForm, { EhrInfoLegeerklaeringForm } from '@/app/components/legeerklaering/LegeerklaeringForm';
import AboutExpansionCard from "@/app/components/legeerklaering/AboutExpansionCard";
import ErrorDisplay from "@/app/components/legeerklaering/ErrorDisplay";
import LoadingIndicator from "@/app/components/legeerklaering/LoadingIndicator";
import ContactInfoSection from "@/app/components/legeerklaering/ContactInfoSection";
import type NextPageProps from "@/utils/NextPageProps";
import { configureLogger } from '@navikt/next-logger';
import useFhirApi from "@/app/hooks/useFhirApi";
import ensureError from "@/utils/ensureError";
import SimulationIndicator from "@/app/components/simulation/SimulationIndicator";


configureLogger({
    apiPath: '/api/logger',
})

interface PageState extends EhrInfoLegeerklaeringForm {
    readonly loading: boolean;
    readonly error: Error | null;
}

export default function Home({searchParams}: NextPageProps) {
    const [state, setState] = useState<PageState>({
        loading: true,
        error: null,
        doctor: undefined,
        patient: undefined,
        hospital: undefined,
    })
    const onError = useCallback((error: Error) => setState(state => ({...state, error})), [setState])

    const {fhirApi} = useFhirApi(searchParams["launch"] !== undefined, onError, searchParams["simulation"] === "true")
    useEffect(() => {
        if(fhirApi !== null) {
            const fetchFun = async () => {
                try {
                    const {patient, practitioner: doctor, hospital} = await fhirApi.getInitState()

                    setState(state => ({
                        loading: state.loading,
                        doctor,
                        patient,
                        hospital,
                        error: null,
                    }))
                } catch (e) {
                    onError(ensureError(e))
                } finally {
                    setState(state => ({...state, loading: false}))
                }
            }
            fetchFun()
        }
    }, [fhirApi, onError])

    return (
        <div>
            <Header doctor={state.doctor}/>
            <div className="mx-auto mt-16 max-w-4xl p-4 pb-32 ">
                <Heading level="1" size="xlarge">Legeerklæring - pleiepenger sykt barn</Heading>
                <AboutExpansionCard/>
                {
                    state.error ?
                        <ErrorDisplay heading="Feil ved lasting av EHR info" error={state.error}/> :
                        state.loading ? <LoadingIndicator/> :
                            <LegeerklaeringForm doctor={state.doctor} patient={state.patient}
                                                hospital={state.hospital}/>
                }
                <ContactInfoSection/>
            </div>
            <SimulationIndicator api={fhirApi} />
        </div>
    )
}
