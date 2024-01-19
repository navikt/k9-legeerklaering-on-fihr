export type HprNumber = string;

export const isHprNumber = (v: unknown): v is HprNumber => {
    if(v !== undefined) {
        if(typeof v === 'string') {
            const num = Number.parseInt(v)
            return Number.isSafeInteger(num) && num > 0
        } else if (typeof v === 'number') {
            return Number.isSafeInteger(v) && v > 0
        }
    }
    return false
}
