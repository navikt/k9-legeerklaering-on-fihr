'use client';

import "@navikt/ds-css";
import React, { useCallback, useContext, useEffect, useState } from 'react';
import FhirApiContext from "@/app/(withApis)/FhirApiContext";
import { isInited, isInitError, isIniting } from '@/app/hooks/useAsyncInit';
import ensureError from '@/utils/ensureError';
import LegeerklaeringForm from '@/app/components/legeerklaering/LegeerklaeringForm';
import LoadingIndicator from '@/app/components/legeerklaering/LoadingIndicator';
import ErrorDisplay from '@/app/components/legeerklaering/ErrorDisplay';
import { Box, HStack, VStack } from '@navikt/ds-react';
import TopBar from '@/app/components/topbar/TopBar';
import { BaseApi, useBaseApi } from '@/app/(withApis)/BaseApi';
import LegeerklaeringDokument from "@/models/LegeerklaeringDokument";
import SelfApiContext from "@/app/(withApis)/SelfApiContext";
import { useRouter } from "next/navigation";
import Practitioner from "@/models/Practitioner";
import Patient from "@/models/Patient";
import Hospital from "@/models/Hospital";

export const dynamic = 'force-dynamic'

export interface PageState {
    readonly doctor: Practitioner | undefined;
    readonly patient: Patient | undefined;
    readonly hospital: Hospital | undefined;
    readonly loading: boolean;
    readonly error: Error | null;
}

export default function Home() {
    const fhirApi = useContext(FhirApiContext)
    const helseOpplysningerApi = useContext(SelfApiContext)
    const baseApi: BaseApi = useBaseApi(fhirApi)
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

    const [state, setState] = useState<PageState>({
        loading: true,
        error: null,
        doctor: undefined,
        patient: undefined,
        hospital: undefined,
    })

    const onError = useCallback((error: Error) => setState(state => ({...state, error})), [setState])

    useEffect(() => {
        if (isInited(fhirApi)) {
            const fetchFun = async () => {
                try {
                    const {patient, practitioner: doctor, hospital} = await fhirApi.getInitState()

                    setState(state => ({
                        loading: state.loading,
                        doctor,
                        patient,
                        hospital,
                        error: null,
                    }))
                } catch (e) {
                    onError(ensureError(e))
                } finally {
                    setState(state => ({...state, loading: false}))
                }
            }
            fetchFun()
        } else if (isInitError(fhirApi)) {
            onError(fhirApi.initError)
        }
    }, [fhirApi, onError])

    return <VStack>
        <TopBar loading={baseApi.loading !== false} reload={baseApi.refreshInitData}
                user={baseApi.initData?.practitioner}/>
            <Box className="flex justify-center" padding={{ xs: "2", md: "6" }}>
                <VStack gap="2">
                        <HStack align="center" justify="start">
                            {state.error ? (
                                <ErrorDisplay heading="Feil ved lasting av EHR info" error={state.error}/>
                            ) : state.loading ? (
                                <LoadingIndicator txt={isIniting(fhirApi) ? "Kobler til systemtjenester" : undefined}/>
                            ) : (
                                <LegeerklaeringForm
                                    doctor={state.doctor}
                                    patient={state.patient}
                                    hospital={state.hospital}
                                    onFormSubmit={handleFormSubmit}
                                />
                            )}
                        </HStack>
                </VStack>
            </Box>
    </VStack>
}
