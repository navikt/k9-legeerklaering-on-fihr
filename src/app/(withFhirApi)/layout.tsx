'use client'

import ChildrenProp from "@/utils/ChildrenProp";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { clientInitInBrowser } from "@/integrations/fhir/clientInit";
import { useAsyncInit } from "@/app/hooks/useAsyncInit";
import FhirApiContext from "@/app/(withFhirApi)/FhirApiContext";
import { configureLogger } from "@navikt/next-logger";
import { initFakeApi1 } from "@/app/simulation/fakeFhirApi1";
import {
    clearFakeFhirApiName,
    FakeFhirApiName,
    getFakeFhirApiName,
} from "@/app/simulation/fakeFhirApiFlag";
import AltLink from "@/app/(withFhirApi)/alt/AltLink";
import SimulationIndicator from "@/app/components/simulation/SimulationIndicator";

export const dynamic = 'force-dynamic'

configureLogger({
    apiPath: '/api/logger',
})


const Layout = ({children}: ChildrenProp) => {
    const searchParams = useSearchParams()
    const isLaunch = searchParams.has("launch")
    const fakeFhirApiName = useRef<FakeFhirApiName | null>(null)
    useEffect(() => {
        if(!isLaunch) {
            fakeFhirApiName.current = getFakeFhirApiName()
        } else {
            clearFakeFhirApiName()
        }
    }, [isLaunch])
    const clientFactory = useCallback(() => {
        if (fakeFhirApiName.current === "fake1") {
            return initFakeApi1()
        } else {
            return clientInitInBrowser(isLaunch)
        }
    }, [isLaunch, fakeFhirApiName])
    const fhirApi = useAsyncInit(clientFactory)

    return <>
        <FhirApiContext.Provider value={fhirApi}>
            {children}
        </FhirApiContext.Provider>
        <AltLink></AltLink>
        <SimulationIndicator simulationName={fakeFhirApiName.current ||undefined}/>
    </>
}

export default Layout