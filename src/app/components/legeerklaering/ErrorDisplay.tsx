import { Alert, Heading } from "@navikt/ds-react";
import { componentSize } from '@/utils/constants';

export interface ErrorDisplayProps {
    readonly heading?: string;
    readonly error: Error
}

export default function ErrorDisplay({heading, error}: ErrorDisplayProps) {
    const headingElem = heading ?
        <Heading size={componentSize} level="3">
            {heading}
        </Heading> :
        null;
    return (
        <Alert variant="error">
            { headingElem }
            {error.message}
        </Alert>
    );
}
