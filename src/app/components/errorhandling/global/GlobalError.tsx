import { Button } from "@navikt/ds-react";
import FeedbackEmail from "@/app/components/feedback/FeedbackEmail";
import NextErrorProps from "@/utils/NextErrorProps";

/**
 * This is the component rendering the root error page, which will receive any error not handled further down.
 * It is therefore very important that this is a simple, robust function with minimal risk of itself throwing any
 * unhandled error.
 */
const GlobalError = ({error, reset}: NextErrorProps) => {
    const subjectSuggestion = `Feilrapport legeerklæring pilot (${error.digest})`
    return <div className="global-error">
        <h2>Uhåndtert feil</h2>
        <p>
            En uventet feil oppsto. Lukk/gjenåpne vinduet for å prøve på nytt.
        </p>
        <p>
            Meld gjerne fra til <FeedbackEmail subjectSuggestion={subjectSuggestion}/> hvis problemet vedvarer.
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
        <p>
            <Button type="button" onClick={reset}>Prøv på nytt</Button>
        </p>
    </div>
}

export default GlobalError