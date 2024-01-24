import { useEffect, useState } from "react";
import ensureError from "@/utils/ensureError";

export interface InitError {
    readonly initError: Error;
    readonly initing?: never;
}

export interface Initing {
    readonly initError?: never;
    readonly initing: boolean;
}

export type Inited<T> = T & {
    readonly initError?: never;
    readonly initing?: never;
}

export type AsyncInit<T> = Initing | Inited<T> | InitError;

export const isInited = <T>(asyncInit: AsyncInit<T>): asyncInit is Inited<T> => asyncInit.initing === undefined && asyncInit.initError === undefined

export const isIniting = <T>(asyncInit: AsyncInit<T>): asyncInit is Initing => asyncInit.initing === true

export const isInitError = <T>(asyncInit: AsyncInit<T>): asyncInit is InitError => asyncInit.initError !== undefined

export const useAsyncInit = <T extends {}>(initor: () => Promise<T>): AsyncInit<T> => {
    const [state, setState] = useState<AsyncInit<T>>({
        initing: false
    })
    useEffect(() => {
        if(state.initing === false) {
            setState({initing: true})
            const doInit = async () => {
                try {
                    const inited: T = await initor()
                    setState(inited)
                } catch (e) {
                    setState({initError: ensureError(e)})
                }
            }
            doInit()
        }
    }, [state, setState, initor])
    return state
}