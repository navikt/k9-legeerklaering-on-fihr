import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';
import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { tekst } from '@/utils/tekster';
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightLastIcon } from '@navikt/aksel-icons';

export interface LegeerklaeringOppsummeringProps {
    data: LegeerklaeringData;
    pdf: Blob
    handleJournalfør: () => void;
    handleSkjulOppsummering: () => void;
}

const LegeerklaeringOppsummering = ({
                                        data,
                                        pdf,
                                        handleSkjulOppsummering,
                                        handleJournalfør
                                    }: LegeerklaeringOppsummeringProps) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        // Create a URL for the Blob
        const newPdfUrl = window.URL.createObjectURL(pdf);
        setPdfUrl(newPdfUrl);

        // Cleanup function to revoke the URL when the component unmounts
        return () => {
            window.URL.revokeObjectURL(newPdfUrl);
        };
    }, [pdf]);

    return (
        <VStack className="mt-4 w-100" gap={"6"}>
            <HStack>
                <Heading size="small">Forhåndsvisning</Heading>
            </HStack>
            <HStack align="center" justify="center">
                {pdfUrl &&
                    <iframe src={pdfUrl} width="100%" height="1150px"/>
                }
            </HStack>
            <HStack>
                <Alert variant="info">{tekst("legeerklaering.oppsummering.info")}</Alert>
            </HStack>
            <HStack gap={"4"}>
                <Button
                    variant="secondary"
                    icon={<ChevronLeftIcon aria-hidden/>}
                    iconPosition="left"
                    onClick={handleSkjulOppsummering}
                >
                    Tilbake
                </Button>

                <Button
                    onClick={handleJournalfør}
                    icon={<ChevronRightLastIcon aria-hidden/>}
                    iconPosition="right"
                >
                    Godkjenn og send inn
                </Button>
            </HStack>
        </VStack>
    )
}

export default LegeerklaeringOppsummering;
