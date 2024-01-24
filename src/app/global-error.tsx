'use client'

import NextErrorProps from "@/utils/NextErrorProps";
import GlobalError from "@/app/components/errorhandling/global/GlobalError";

/**
 * This is the root error page, which will receive any error not handled further down.
 * It is therefore very important that this, and all components used within, is simple and robust, with minimal risk of
 * throwing any unhandled error.
 */
const GlobalErrorPage = ({error, reset}: NextErrorProps) => {
    return (
        <html>
        <body>
            <GlobalError error={error} reset={reset} />
        </body>
        </html>
    )
}

export default GlobalErrorPage