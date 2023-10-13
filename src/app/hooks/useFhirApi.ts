import { FhirApi } from "@/integrations/fhir/FhirApi";
import { useEffect, useState } from "react";
import { clientInitInBrowser } from "@/integrations/fhir/clientInit";
import ensureError from "@/utils/ensureError";
import { isSimulationAllowed } from "@/utils/environment";

export interface FhirApiHook {
    readonly fhirApi: FhirApi | null;
    readonly initError: Error | null;
}

let _presetFhirApi: FhirApi | null = null;

export const presetFhirApi = (api: FhirApi | null) => {
    if(isSimulationAllowed()) {
        _presetFhirApi = api
    } else {
        throw new Error(`presetting FhirApi implementation is only allowed when simulation is allowed`)
    }
}

const useFhirApi = (isLaunch: boolean, isSimulationLaunch: boolean = false): FhirApiHook => {
    const [state, setState] = useState<FhirApiHook>({
        fhirApi: _presetFhirApi,
        initError: null,
    })
    useEffect(() => {
        if(state.fhirApi === null || isLaunch) {
            const doInit = async () => {
                try {
                    const fhirApi = await clientInitInBrowser(isLaunch, isSimulationLaunch)
                    setState({fhirApi, initError: null})
                } catch (e) {
                    setState({
                        fhirApi: null,
                        initError: ensureError(e)
                    })
                }
            }
            doInit()
        }
    }, [state, isLaunch, isSimulationLaunch])
    return state
}

export default useFhirApi