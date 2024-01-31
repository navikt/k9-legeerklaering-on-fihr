'use client'

import ChildrenProp from "@/utils/ChildrenProp";
import { useEffect, useState } from "react";
import ensureError from "@/utils/ensureError";
import GlobalError from "@/app/components/errorhandling/global/GlobalError";

/**
 * This layout serves as a top-level client side error handler to ensure that the user is shown an error page when a promise
 * fails without being handled further down in the component stack.
 * @param children
 * @constructor
 */
const Layout = ({children}: ChildrenProp) => {
    const [error, setError] = useState<Error | undefined>(undefined)
    // Add top-level error handler for uncaught promise rejections
    useEffect(() => {
        if(window) {
            const abortController = new AbortController()
            window.addEventListener("unhandledrejection", (event) => {
                setError(ensureError(event.reason))
            }, {signal: abortController.signal})
            return () => {
                abortController.abort("layout unmount")
            }
        }
    }, []);

    if(error !== undefined) {
        const reset = () => window.location.reload()
        return <GlobalError error={error} reset={reset} />
    } else {
        return children
    }
}

export default Layout