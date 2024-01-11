'use client'

import ChildrenProp from "@/utils/ChildrenProp";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { clientInitInBrowser } from "@/integrations/fhir/clientInit";
import { useAsyncInit } from "@/app/hooks/useAsyncInit";
import FhirApiContext from "@/app/(withApis)/FhirApiContext";
import { configureLogger } from "@navikt/next-logger";
import { initFakeFhirApi1 } from "@/app/simulation/fakeFhirApi1";
import { clearFakeFhirApiName, FakeFhirApiName, getFakeFhirApiName, } from "@/app/simulation/fakeFhirApiFlag";
import AltLink from "@/app/(withApis)/alt/AltLink";
import SimulationIndicator from "@/app/components/simulation/SimulationIndicator";
import SelfApiContext from "@/app/(withApis)/SelfApiContext";
import { SelfClient } from "@/integrations/self/SelfClient";

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
            return initFakeFhirApi1()
        } else {
            return clientInitInBrowser(isLaunch)
        }
    }, [isLaunch, fakeFhirApiName])
    const fhirApi = useAsyncInit(clientFactory)

    const selfApi = new SelfClient()

    return <>
        <FhirApiContext.Provider value={fhirApi}>
            <SelfApiContext.Provider value={selfApi}>
                {children}
            </SelfApiContext.Provider>
        </FhirApiContext.Provider>
        <AltLink></AltLink>
        <SimulationIndicator simulationName={fakeFhirApiName.current ||undefined}/>
    </>
}

export default Layout