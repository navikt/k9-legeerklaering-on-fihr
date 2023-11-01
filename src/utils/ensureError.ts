/**
 * Small helper to convert anything other than error to an error instance, to normalize behaviour in error handlers.
 * @param e
 */
const ensureError = (e: Error | unknown): Error => {
    if(e instanceof Error) {
        return e
    } else {
        return new Error(`${e}`)
    }
}

export default ensureError;