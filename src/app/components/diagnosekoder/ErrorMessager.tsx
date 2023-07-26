import {ErrorMessage} from "@navikt/ds-react";
import React, {ReactNode} from "react";

export interface ErrorMessagerProps {
    readonly error: ReactNode;
}

/**
 * Based on implementation in https://github.com/navikt/aksel/blob/main/%40navikt/core/react/src/form/TextField.tsx
 * Just a small convenience to add ErrorMessage to a input component so that it behaves as other aksel components.
 * NB: To get styling of error to match aksel TextField exactly, the component using this must have class "navds-form-field".
 * This is just to get the bullet point marker in front error message.
 *
 * @param error
 * @constructor
 */
export default function ErrorMessager({error}: ErrorMessagerProps) {
    return (
        <div
            className="navds-form-field__error"
            aria-relevant="additions removals"
            aria-live="polite"
        >
            {error && (
                <ErrorMessage size="medium">{error}</ErrorMessage>
            )}
        </div>
    )
}