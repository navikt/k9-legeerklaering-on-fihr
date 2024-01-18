
export class FhirAuthError extends Error {

    constructor(msg: string, options?: ErrorOptions) {
        super(msg, options);
        this.name = this.constructor.name

        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, FhirAuthError)
        }
    }
}