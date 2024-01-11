import { createContext, useCallback, useEffect, useState } from "react";
import InitData from "@/models/InitData";
import { AsyncInit, isInited, isInitError, isIniting } from "@/app/hooks/useAsyncInit";
import { FhirApi } from "@/integrations/fhir/FhirApi";
import ensureError from "@/utils/ensureError";

export interface BaseApi {
    readonly loading: 'fhirConnecting' | 'fhirLoading' | false;
    readonly error: Error | null;
    readonly initData: InitData | null;
    refreshInitData(): Promise<void>;
}

const defaultValue: BaseApi = {
    loading: false,
    error: null,
    initData: null,
    async refreshInitData(): Promise<void> {
        throw new Error("refreshInitData not implemented in initial api")
    }
}

export const BaseApiContext = createContext<BaseApi>(defaultValue)

export const useBaseApi = (fhirApi: AsyncInit<FhirApi>): BaseApi => {
    const [state, setState] = useState<BaseApi>(defaultValue)
    const onError = useCallback((error: Error) => setState(state => ({...state, error, loading: false})), [setState])
    const setLoading = useCallback((loading: BaseApi["loading"]) => setState(state => ({...state, loading})), [setState])

    useEffect(() => {
        if(isIniting(fhirApi)) {
            setLoading('fhirConnecting')
        } else if(isInited(fhirApi)) {
            let refreshInitData: () => Promise<void>;
            const fetchFun = async () => {
                try {
                    setLoading('fhirLoading');
                    const initData = await fhirApi.getInitState()
                    setState(state => ({
                        loading: false,
                        initData,
                        error: null,
                        refreshInitData,
                    }))
                } catch (e) {
                    onError(ensureError(e))
                }
            }
            refreshInitData = fetchFun;
            fetchFun()
        } else if(isInitError(fhirApi)) {
            onError(fhirApi.initError)
        }
    }, [fhirApi, onError, setLoading])

    return state
}