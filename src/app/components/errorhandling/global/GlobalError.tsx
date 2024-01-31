import { Button } from "@navikt/ds-react";
import FeedbackEmail from "@/app/components/feedback/FeedbackEmail";
import NextErrorProps from "@/utils/NextErrorProps";
import { subjectSuggestion } from "@/app/components/errorhandling/subjectSuggestion";
import { FhirInitError } from "@/integrations/fhir/FhirInitError";
import ChildrenProp from "@/utils/ChildrenProp";

interface BoldIfTrueProps extends ChildrenProp {
    readonly isTrue: boolean;
}

const BoldIfTrue = ({isTrue, children}: BoldIfTrueProps) => {
    if(isTrue) {
        return <b>{children}</b>
    } else {
        return children
    }
}

/**
 * This is the component rendering the root error page, which will receive any error not handled further down.
 * It is therefore very important that this is a simple, robust function with minimal risk of itself throwing any
 * unhandled error.
 */
const GlobalError = ({error, reset}: NextErrorProps) => {
    const isNotRetryable = error instanceof FhirInitError
    const isRetryable = !isNotRetryable
    return <div className="global-error">
        <h2>Uhåndtert feil</h2>
        <p>
            En uventet feil oppsto. <BoldIfTrue isTrue={isNotRetryable}>Lukk/gjenåpne vinduet for å prøve på nytt.</BoldIfTrue>
        </p>
        <p>
            Meld gjerne fra til <FeedbackEmail subjectSuggestion={subjectSuggestion(error.digest)}/> hvis problemet vedvarer.
            Inkluder i såfall feilmelding {error.digest !== undefined ? 'og feilreferanse' : null} i e-posten.
        </p>
        <p>
            <b>Feilmelding: </b><br/>
            {error.message}
        </p>
        {error.digest !== undefined ?
            <p>
                <b>Referanse:</b>
                {error.digest}
            </p>
            : undefined
        }
        {isRetryable ?
            <p>
                <Button type="button" onClick={reset}>Prøv på nytt</Button>
            </p>
            : undefined
        }
    </div>
}

export default GlobalError