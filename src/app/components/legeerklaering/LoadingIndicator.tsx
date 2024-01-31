import {Loader} from "@navikt/ds-react";

import css from './legeerklaering.module.css'
import { BaseApi } from "@/app/(withErrorCapture)/(withApis)/BaseApi";

export interface LoadingIndicatorProps {
    readonly txt?: string;
}


export const loadingTxt = (loading: BaseApi["loading"]): string | undefined =>
    loading === 'fhirConnecting' ?
        "Kobler til journalsystem":
        loading === 'fhirLoading' ?
            "Henter informasjon fra Journalsystem" :
            loading === 'hookIniting' ?
                "Initialiserer klient":
                undefined ;

const LoadingIndicator = ({txt = "Laster EHR informasjon"}: LoadingIndicatorProps) => {
    return (
        <div className={css.loadingContainer}>
            <Loader size="3xlarge" />
            <div role="alert">{ txt }</div>
        </div>
    )
}

export default LoadingIndicator