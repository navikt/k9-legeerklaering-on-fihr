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

export interface LegeerklaeringPageApi extends FhirApi {
    readonly initError?: never;
    readonly initing?: never;
}

export interface LegeerklaeringPageApiInitError {
    readonly initError: Error;
    readonly initing?: never;
}

export interface LegeerklaeringPageApiLoading {
    readonly initing: boolean;
    readonly initError?: never;
}

export type MaybeLegeerklaeringPageApi = LegeerklaeringPageApi | LegeerklaeringPageApiInitError | LegeerklaeringPageApiLoading;

export interface LegeerklaeringPageProps {
    readonly api: MaybeLegeerklaeringPageApi
}

interface PageState extends EhrInfoLegeerklaeringForm {
    readonly loading: boolean;
    readonly error: Error | null;
}

const isApi = (api: MaybeLegeerklaeringPageApi): api is LegeerklaeringPageApi => {
    return !api.initError && !api.initing
}

const isApiInitError = (api: MaybeLegeerklaeringPageApi): api is LegeerklaeringPageApiInitError => {
    return api.initError !== undefined
}

const isApiIniting = (api: MaybeLegeerklaeringPageApi): api is LegeerklaeringPageApiLoading => {
    return api.initing === true
}

const LegeerklaeringPage = ({api}: LegeerklaeringPageProps) => {
    const [state, setState] = useState<PageState>({
        loading: true,
        error: null,
        doctor: undefined,
        patient: undefined,
        hospital: undefined,
    })
    const onError = useCallback((error: Error) => setState(state => ({...state, error})), [setState])

    useEffect(() => {
        if(isApi(api)) {
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
        } else if(isApiInitError(api)) {
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
                            <LoadingIndicator txt={isApiIniting(api) ? "Kobler til systemtjenester" : undefined} /> :
                            <>
                                <LegeerklaeringForm doctor={state.doctor} patient={state.patient} hospital={state.hospital}/>
                                {
                                    isApi(api) ?
                                        <SimulationIndicator api={api} /> :
                                        null
                                }
                            </>

                }
                <ContactInfoSection/>
            </div>
        </>
    )
}

export default LegeerklaeringPage;