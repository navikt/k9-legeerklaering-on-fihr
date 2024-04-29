'use client';

import "@navikt/ds-css";
import React, { useContext } from 'react';
import FhirApiContext from "@/app/(withErrorCapture)/(withApis)/FhirApiContext";
import { isInited } from '@/app/hooks/useAsyncInit';
import LegeerklaeringForm from '@/app/components/legeerklaering/LegeerklaeringForm';
import { VStack } from '@navikt/ds-react';
import TopBar from '@/app/components/topbar/TopBar';
import { BaseApi, BaseApiContext } from '@/app/(withErrorCapture)/(withApis)/BaseApi';
import LegeerklaeringDokument from "@/models/LegeerklaeringDokument";
import SelfApiContext from "@/app/(withErrorCapture)/(withApis)/SelfApiContext";
import { useRouter } from "next/navigation";
import CenterColumn from "@/app/components/CenterColumn";
import InitDataDependentRender from "@/app/components/InitDataDependentRender";

export const dynamic = 'force-dynamic'

export default function Home() {
    const fhirApi = useContext(FhirApiContext)
    const helseOpplysningerApi = useContext(SelfApiContext)
    const baseApi: BaseApi = useContext(BaseApiContext)
    const router = useRouter()

    const handleFormSubmit = async (submittedData: LegeerklaeringDokument) => {
        if(isInited(fhirApi)) {
            const pdf = await helseOpplysningerApi.generatePdf(submittedData)
            const documentId = await fhirApi.createDocument(submittedData.barn.ehrId, submittedData.lege.practitionerRoleId!!, submittedData.dokumentAnsvarlig, submittedData.dokumentReferanse, pdf)
            router.push(`/document/${documentId}`)
        } else {
            throw new Error("fhirApi not initialized, cannot submit")
        }
    }

    return <VStack>
        <TopBar loading={baseApi.loading !== false}
                reload={baseApi.refreshInitData}
                user={baseApi.initData?.practitioner}/>
        <CenterColumn>
            <InitDataDependentRender
                baseApi={baseApi}
                render={(initData) => {
                return <LegeerklaeringForm
                    doctor={initData.practitioner}
                    patient={initData.patient}
                    hospital={initData.hospital}
                    onFormSubmit={handleFormSubmit}
                />
            }} />
        </CenterColumn>
    </VStack>
}
