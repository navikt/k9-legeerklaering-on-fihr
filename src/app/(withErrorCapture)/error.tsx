'use client'
import NextErrorProps from "@/utils/NextErrorProps";
import TopBar from "@/app/components/topbar/TopBar";
import CenterColumn from "@/app/components/CenterColumn";
import { Alert, BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import React, { useContext } from "react";
import FhirApiContext from "@/app/(withErrorCapture)/(withApis)/FhirApiContext";
import { BaseApi, useBaseApi } from "@/app/(withErrorCapture)/(withApis)/BaseApi";
import FeedbackEmail from "@/app/components/feedback/FeedbackEmail";
import { subjectSuggestion } from "@/app/components/errorhandling/subjectSuggestion";

const Error = ({error, reset}: NextErrorProps) => {
    const fhirApi = useContext(FhirApiContext)
    const baseApi: BaseApi = useBaseApi(fhirApi)

    const reload = async () => {
        reset()
        await baseApi.refreshInitData()
    }
    return <VStack>
        <TopBar loading={baseApi.loading !== false}
                reload={reload}
                user={baseApi.initData?.practitioner}/>
        <CenterColumn>
            <BodyLong size="large" spacing>
            <Alert variant="error">
                <Heading size="medium">
                    Uventa feil oppsto
                </Heading>
                <p>
                    {error.message}
                </p>
                {error.digest !== undefined ?
                    <p>Referanse: {error.digest}</p> :
                    null
                }
            </Alert>
            </BodyLong>
            <BodyLong size="large" spacing>
                    Meld gjerne fra til <FeedbackEmail subjectSuggestion={subjectSuggestion(error.digest)}/> hvis problemet vedvarer.
                    Inkluder i såfall feilmelding {error.digest !== undefined ? 'og feilreferanse' : null} i e-posten.
            </BodyLong>
            <BodyLong align="center">
                <Button type="button" onClick={reset}>Prøv på nytt</Button>
            </BodyLong>
        </CenterColumn>
    </VStack>
}

export default Error;