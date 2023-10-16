'use client';

import "@navikt/ds-css";
import React, {useCallback, useState} from 'react';
import type NextPageProps from "@/utils/NextPageProps";
import {configureLogger} from '@navikt/next-logger';
import LegeerklaeringPage from "@/app/components/legeerklaering/LegeerklaeringPage";
import {clientInitInBrowser} from "@/integrations/fhir/clientInit";
import {useAsyncInit} from "@/app/hooks/useAsyncInit";


configureLogger({
    apiPath: '/api/logger',
})

export default function Home({searchParams}: NextPageProps) {
    const isLaunch = searchParams["launch"] !== undefined
    const isSimulation = searchParams["simulation"] === "true"
    const clientFactory = useCallback(() => clientInitInBrowser(isLaunch, isSimulation), [isLaunch, isSimulation])
    const fhirApi = useAsyncInit(clientFactory)
    return <LegeerklaeringPage api={fhirApi} />
}
