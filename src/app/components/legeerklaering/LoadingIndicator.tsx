import {Loader} from "@navikt/ds-react";

import css from './legeerklaering.module.css'

export default function LoadingIndicator() {
    return (
        <div className={css.loadingContainer}>
            <Loader size="3xlarge" />
            <div role="alert">Laster EHR informasjon</div>
        </div>
    )
}