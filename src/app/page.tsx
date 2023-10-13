'use client';

import "@navikt/ds-css";
import React, {useCallback, useState} from 'react';
import type NextPageProps from "@/utils/NextPageProps";
import {configureLogger} from '@navikt/next-logger';
import useFhirApi from "@/app/hooks/useFhirApi";
import LegeerklaeringPage from "@/app/components/legeerklaering/LegeerklaeringPage";


configureLogger({
    apiPath: '/api/logger',
})

interface PageState {
    readonly error: Error | null;
}

export default function Home({searchParams}: NextPageProps) {
    const [{error}, setState] = useState<PageState>({
        error: null,
    })
    const onError = useCallback((error: Error) => setState(state => ({...state, error})), [setState])

    const {fhirApi, initError} = useFhirApi(searchParams["launch"] !== undefined, searchParams["simulation"] === "true")
    const api = fhirApi !== null ? fhirApi : error !== null ? {initError: error} : {initing: true}
    return <LegeerklaeringPage api={api} />
}
