'use client'

import ChildrenProp from "@/utils/ChildrenProp";
import {useCallback, useState} from "react";
import {useAsyncInit} from "@/app/hooks/useAsyncInit";
import FhirApiContext from "@/app/(withErrorCapture)/(withApis)/FhirApiContext";
import {configureLogger} from "@navikt/next-logger";
import AltLink from "@/app/(withErrorCapture)/(withApis)/alt/AltLink";
import SelfApiContext from "@/app/(withErrorCapture)/(withApis)/SelfApiContext";
import {SelfClient} from "@/integrations/self/SelfClient";
import {FhirApi} from "@/integrations/fhir/FhirApi";
import ProxiedFhirClientWrapper from "@/integrations/fhir/ProxiedFhirClientWrapper";
import {recognizedServers} from "@/integrations/fhir/recognizedServers";
import FhirClientWrapper from "@/integrations/fhir/FhirClientWrapper";
import {BaseApi, BaseApiContext, useBaseApi} from "@/app/(withErrorCapture)/(withApis)/BaseApi";
import {useFhirClient} from "@/integrations/fhir/useFhirClient";

export const dynamic = 'force-dynamic'

configureLogger({
    apiPath: '/api/logger',
})

const Layout = ({children}: ChildrenProp) => {
    const fhirClient = useFhirClient()
    const [isLoading, setIsLoading] = useState(false)

    // This callback can create a FhirApi instance, real or fake
    const initFhirApi: () => Promise<FhirApi> = useCallback(async () => {
        setIsLoading(true)
        console.info("Creating FhirApi instance...", JSON.stringify(fhirClient?.state, null, 2))

        if (!fhirClient) {
            const errMessage = "FHIR client is not initialized"
            console.error(errMessage)
            throw new Error(errMessage)
        }

        setIsLoading(false)
        const serverUrl = fhirClient.state.serverUrl
        console.info("FHIR server url:", serverUrl)

        if (serverUrl === recognizedServers.OPENDIPS_TEST) {
            /* TODO Open DIPS (test) krever at man legger til api-key på kallene,
                derfor er dette en løsning kun for bruk med Open DIPS */
            console.info("Redirecting all traffic through proxy", serverUrl)
            return new ProxiedFhirClientWrapper(fhirClient)
        }

        console.info("Direct client initialization from server", serverUrl)
        return new FhirClientWrapper(fhirClient)
    }, [fhirClient])

    const fhirApi = useAsyncInit(initFhirApi)

    // The SelfClient needs to be able to retrieve the fhir client auth token, so it can pass it to our own server
    const getFhirAuthToken = async () => {
        console.info("Retrieving FHIR auth token...", JSON.stringify(fhirClient?.state, null, 2))
        if (fhirClient) {
            setIsLoading(false) // TODO backup
            return fhirClient.getAuthorizationHeader()
        }
    }

    const selfApi = new SelfClient(getFhirAuthToken)
    const baseApi: BaseApi = useBaseApi(fhirApi)

    console.info("BaseApi", JSON.stringify(baseApi, null, 2))

    return <>
        <FhirApiContext.Provider value={fhirApi}>
            <SelfApiContext.Provider value={selfApi}>
                <BaseApiContext.Provider value={baseApi}>
                    {
                        isLoading ? (
                            <div><h3>Laster FHIR ressurser...</h3></div>
                        ) : (
                            <>
                                {children}
                                <AltLink></AltLink>
                            </>
                        )
                    }
                </BaseApiContext.Provider>
            </SelfApiContext.Provider>
        </FhirApiContext.Provider>
    </>
}

export default Layout