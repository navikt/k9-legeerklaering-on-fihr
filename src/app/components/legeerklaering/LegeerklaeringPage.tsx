'use client';

import Header from "@/app/components/Header";
import { Heading } from "@navikt/ds-react";
import AboutExpansionCard from "@/app/components/legeerklaering/AboutExpansionCard";
import ErrorDisplay from "@/app/components/legeerklaering/ErrorDisplay";
import LoadingIndicator from "@/app/components/legeerklaering/LoadingIndicator";
import LegeerklaeringForm, { EhrInfoLegeerklaeringForm } from "@/app/components/legeerklaering/LegeerklaeringForm";
import ContactInfoSection from "@/app/components/legeerklaering/ContactInfoSection";
import SimulationIndicator from "@/app/components/simulation/SimulationIndicator";
import React, { useCallback, useEffect, useState } from "react";
import { FhirApi } from "@/integrations/fhir/FhirApi";
import ensureError from "@/utils/ensureError";
import { AsyncInit, isInited, isInitError, isIniting } from "@/app/hooks/useAsyncInit";

export interface LegeerklaeringPageProps {
    readonly api: AsyncInit<FhirApi>;
    readonly simulationName?: string;
}

interface PageState extends EhrInfoLegeerklaeringForm {
    readonly loading: boolean;
    readonly error: Error | null;
}


const LegeerklaeringPage = ({api, simulationName}: LegeerklaeringPageProps) => {
    const [state, setState] = useState<PageState>({
        loading: true,
        error: null,
        doctor: undefined,
        patient: undefined,
        hospital: undefined,
    })
    const onError = useCallback((error: Error) => setState(state => ({...state, error})), [setState])

    useEffect(() => {
        if(isInited(api)) {
            const fetchFun = async () => {
                try {
                    const {patient, practitioner: doctor, hospital} = await api.getInitState()

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
        } else if(isInitError(api)) {
            onError(api.initError)
        }
    }, [api, onError])

    return (
        <>
            <Header doctor={state.doctor}/>
            <div className="mx-auto mt-16 max-w-4xl p-4 pb-32 ">
                <Heading level="1" size="xlarge">Legeerklæring - pleiepenger sykt barn</Heading>
                <AboutExpansionCard/>
                {
                    state.error ?
                        <ErrorDisplay heading="Feil ved lasting av EHR info" error={state.error}/> :
                        state.loading ?
                            <LoadingIndicator txt={isIniting(api) ? "Kobler til systemtjenester" : undefined} /> :
                            <>
                                <LegeerklaeringForm doctor={state.doctor} patient={state.patient} hospital={state.hospital}/>
                                <SimulationIndicator simulationName={simulationName} /> :
                            </>

                }
                <ContactInfoSection/>
            </div>
        </>
    )
}

export default LegeerklaeringPage;