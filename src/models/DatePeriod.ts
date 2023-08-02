export default interface DatePeriod {
    readonly start?: Date;
    readonly end?: Date;
}

export const datePeriod = (start: Date | undefined, end: Date | undefined): DatePeriod => ({ start, end })

export const datePeriodsEqual = (a: DatePeriod | undefined, b: DatePeriod | undefined): boolean =>
    a === b ||
    (a?.start?.getTime() === b?.start?.getTime() && a?.end?.getTime() === b?.end?.getTime())