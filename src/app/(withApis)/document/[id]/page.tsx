'use client'
import FhirApiContext from "@/app/(withApis)/FhirApiContext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { isInited, isInitError, isIniting } from "@/app/hooks/useAsyncInit";
import { Alert, BodyShort, Box, Button, Heading, Link, VStack } from "@navikt/ds-react";
import { useBaseApi } from "@/app/(withApis)/BaseApi";
import TopBar from "@/app/components/topbar/TopBar";
import NavNextLink from "@/app/components/NavNextLink";

export default function DocumentViewPage({params}: {params: {id: string}}) {
    const fhirApi = useContext(FhirApiContext)
    const baseApi = useBaseApi(fhirApi)
    const [pdfUrl, setPdfUrl] = useState<string | undefined>()

    const loadDocument = useCallback(async() => {
    if (isInited(fhirApi)) {
            const pdfBlob = await fhirApi.getDocumentPdf(params.id)
            setPdfUrl(URL.createObjectURL(pdfBlob)) // Iframe needs an object url created from the pdf blob
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
        console.debug("close window")
        window.close()
    }

    return <VStack>
        <TopBar
            loading={baseApi.loading !== false || isIniting(fhirApi)}
            reload={reload}
            user={baseApi.initData?.practitioner}
        />
        <Box className="flex justify-center" padding={{xs: "2", md: "6"}}>
            <VStack gap="6">
                <Alert variant="success">
                    <Heading size="medium">Legeerklæring lagret</Heading>
                    <BodyShort size="small">Legeerklæringen er nå lagret i pasientens journal.</BodyShort>
                    <br/>
                    <BodyShort size="small">Husk at den/de som skal søke om pleiepenger må få den overlevert elektronisk
                        eller via papirutskrift, slik at den kan legges ved søknad til NAV.</BodyShort>
                    <br/>
                    <BodyShort size="small">Pdf vises under i tilfelle du ønsker å skrive den ut med en gang</BodyShort>
                </Alert>
                <Box className="flex justify-center">
                    { window.opener !== null ?
                        <Button type="button" onClick={close} size="xsmall" variant="tertiary">Lukk fanen</Button> :
                        <span>Lukk fanen</span>
                    }
                    <span>, eller gå&nbsp;</span>
                    <NavNextLink href="/">tilbake til ny utfylling</NavNextLink>
                </Box>
            </VStack>
        </Box>
        <iframe src={pdfUrl} width="100%" height="1250px" />
    </VStack>
}