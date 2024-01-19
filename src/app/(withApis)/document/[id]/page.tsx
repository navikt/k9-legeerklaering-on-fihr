'use client'
import FhirApiContext from "@/app/(withApis)/FhirApiContext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { isInited, isInitError, isIniting } from "@/app/hooks/useAsyncInit";
import { Alert, BodyShort, Box, Button, Heading, HStack, Link, Page, VStack } from "@navikt/ds-react";
import { useBaseApi } from "@/app/(withApis)/BaseApi";
import TopBar from "@/app/components/topbar/TopBar";
import NavNextLink from "@/app/components/NavNextLink";
import LoadingIndicator from "@/app/components/legeerklaering/LoadingIndicator";
import PdfIframe from "@/app/(withApis)/document/[id]/PdfIframe";

export default function DocumentViewPage({params}: {params: {id: string}}) {
    const fhirApi = useContext(FhirApiContext)
    const baseApi = useBaseApi(fhirApi)
    const [pdfBlob, setPdfBlob] = useState<Blob | undefined>()

    const loadDocument = useCallback(async() => {
        if (isInited(fhirApi)) {
            // XXX Consider try/catch to get local error handling
            setPdfBlob(await fhirApi.getDocumentPdf(params.id))
        } else if(isInitError(fhirApi)) {
            throw fhirApi.initError
        }
    }, [fhirApi, params])

    useEffect(() => {
        loadDocument()
    }, [loadDocument]);

    const reload = async () => {
        await Promise.all([baseApi.refreshInitData(), loadDocument()])
    }

    const close = () => {
        window.close()
    }

    return <Page>
        <TopBar
            loading={baseApi.loading !== false || isIniting(fhirApi)}
            reload={reload}
            user={baseApi.initData?.practitioner}
        />
        <Box className="flex justify-center" padding={{xs: "2", md: "6"}}>
            <Page.Block width="lg">
            <VStack gap="6">
                <Alert variant="success">
                    <Heading size="medium">Legeerklæring lagret</Heading>
                    <BodyShort size="small" spacing>Legeerklæringen er nå lagret i pasientens journal.</BodyShort>
                </Alert>
                <Alert variant="info">
                    <BodyShort size="small" spacing>Husk at den/de som skal søke om pleiepenger må få den overlevert elektronisk
                        eller via papirutskrift, slik at den kan legges ved søknad til NAV.</BodyShort>
                    <BodyShort size="small" spacing>Pdf vises under i tilfelle du ønsker å skrive den ut med en gang.</BodyShort>
                </Alert>
                <Box className="flex justify-center">
                    { window.opener !== null ? // window.close doesn't work when window was not opened by script. Not sure what the case is in smart on fhir, so testing it here.
                        <Button type="button" onClick={close} size="xsmall" variant="tertiary">Lukk fanen</Button> :
                        <span>Lukk fanen</span>
                    }
                    <span>, eller gå&nbsp;</span>
                    <NavNextLink href="/">til ny utfylling</NavNextLink>
                </Box>
            </VStack>
            </Page.Block>
        </Box>
        <HStack align="center" justify="center" padding="6">
            <Page.Block width="lg">
                <Heading size="small">Lagret PDF:</Heading>
            {
                pdfBlob !== undefined ?
                    <PdfIframe pdf={pdfBlob} width="100%" height="1250px"/> :
                    <LoadingIndicator txt="Henter PDF" />
            }
            </Page.Block>
        </HStack>
    </Page>
}