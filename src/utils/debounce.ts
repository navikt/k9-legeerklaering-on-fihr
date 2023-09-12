
export class AbortedDebounce extends Error {
    static readonly defaultMessage = "Operation cancelled by debounce";

    constructor(message: string = AbortedDebounce.defaultMessage, cause?: Error) {
        super(message, cause);
        this.name = this.constructor.name;
    }
}

const debounce = (millis: number, abortSignal: AbortSignal) => {
    return new Promise<void>((resolve, reject) => {
        if (abortSignal.aborted) {
            // Abort signal already triggered, stop early.
            reject(new AbortedDebounce())
        }
        let timeoutId: number | null | NodeJS.Timeout = null // It is number in browser, NodeJS.Timeout in nodejs.
        // Create an abortListener that gets called if the AbortSignal is triggered.
        const abortListener = () => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
            reject(new AbortedDebounce())
        }
        abortSignal.addEventListener("abort", abortListener);
        timeoutId = setTimeout(() => {
            // Remove the abortListener
            abortSignal.removeEventListener("abort", abortListener)
            resolve()
        }, millis)
    })
}

export default debounce;