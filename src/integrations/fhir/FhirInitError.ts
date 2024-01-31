/**
 * Thrown when initialization of fhir client fails because the context has been lost.
 * So that we can show a special error message then
 */
export class FhirInitError extends Error {
    constructor(msg: string, options?: ErrorOptions) {
        super(msg, options);
        this.name = this.constructor.name

        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, FhirInitError)
        }
    }
}
