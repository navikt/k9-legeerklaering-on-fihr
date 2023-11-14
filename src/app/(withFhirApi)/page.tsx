'use client';

import "@navikt/ds-css";
import React, { useContext } from 'react';
import LegeerklaeringPage from "@/app/components/legeerklaering/LegeerklaeringPage";
import FhirApiContext from "@/app/(withFhirApi)/FhirApiContext";

export const dynamic = 'force-dynamic'

export default function Home() {
    const fhirApi = useContext(FhirApiContext)
    return <LegeerklaeringPage api={fhirApi} />
}
