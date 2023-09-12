
const millisInDay = 1000 * 60 * 60 * 24;

export const dayCount = (start?: Date, end?: Date): number =>
    start !== undefined &&
    end !== undefined &&
    Math.round((end.getTime() - start.getTime()) / millisInDay) ||
    0

/**
 * Returns the date for "the next day" of the given date.
 */
export const addOneDay = (date: Date | undefined): Date | undefined => {
    if (date === undefined) {
        return undefined
    }
    const result = new Date(date); // Clone input before mutating it
    result.setDate(date.getDate() + 1)
    return result
}