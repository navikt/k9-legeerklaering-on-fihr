'use client';

import "@navikt/ds-css";
import React, { useCallback, useEffect, useState } from 'react';
import type NextPageProps from "@/utils/NextPageProps";
import { configureLogger } from '@navikt/next-logger';
import LegeerklaeringPage from "@/app/components/legeerklaering/LegeerklaeringPage";
import { clientInitInBrowser } from "@/integrations/fhir/clientInit";
import { useAsyncInit } from "@/app/hooks/useAsyncInit";

export const dynamic = 'force-dynamic'

configureLogger({
    apiPath: '/api/logger',
})

const storageKeySimulationName = "SimulationName"

const stringOrUndef = (param: string | string[] | undefined): string | undefined =>
    typeof param === "string" && param.length > 0 ? param : undefined

export default function Home({searchParams}: NextPageProps) {
    const isLaunch = searchParams["launch"] !== undefined
    const clientFactory = useCallback(() => clientInitInBrowser(isLaunch), [isLaunch])
    const fhirApi = useAsyncInit(clientFactory)
    // client init function above might reset sessionStorage, so we do the simulation storage call below it
    const [simulationName, setSimulationName] = useState<string | undefined>(undefined)
    useEffect(() => {
        if(isLaunch) {
            const simulation = stringOrUndef(searchParams["simulation"])
            if (simulation !== undefined) {
                sessionStorage.setItem(storageKeySimulationName, simulation)
                setSimulationName(simulation)
            } else {
                sessionStorage.removeItem(storageKeySimulationName)
                setSimulationName(undefined)
            }
        } else {
            setSimulationName(sessionStorage.getItem(storageKeySimulationName) || undefined)
        }
    }, [isLaunch, searchParams])

    return <LegeerklaeringPage api={fhirApi} simulationName={simulationName} />
}
