import {Loader} from "@navikt/ds-react";

import css from './legeerklaering.module.css'

export interface LoadingIndicatorProps {
    readonly txt?: string;
}

const LoadingIndicator = ({txt = "Laster EHR informasjon"}: LoadingIndicatorProps) => {
    return (
        <div className={css.loadingContainer}>
            <Loader size="3xlarge" />
            <div role="alert">{ txt }</div>
        </div>
    )
}

export default LoadingIndicator