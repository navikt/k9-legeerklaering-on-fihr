import TopBar from "@/app/components/topbar/TopBar";
import CenterColumn from "@/app/components/CenterColumn";
import { Alert, BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import FeedbackEmail from "@/app/components/feedback/FeedbackEmail";
import { subjectSuggestion } from "@/app/components/errorhandling/subjectSuggestion";
import React from "react";
import NavNextLink from "@/app/components/NavNextLink";

const NotFoundPage = () => {
    return <VStack>
        <CenterColumn>
            <BodyLong size="large" spacing>
                <Alert variant="error">
                    <Heading size="medium">
                        Ikke funnet
                    </Heading>
                    <p>
                        Siden du prøvde å åpne finnes ikke.
                    </p>
                </Alert>
            </BodyLong>
            <BodyLong size="large" spacing>
                Lukk og gjenåpne vinduet, eller <NavNextLink href="/">gå tilbake til start</NavNextLink>
            </BodyLong>
        </CenterColumn>
    </VStack>
}

export default NotFoundPage