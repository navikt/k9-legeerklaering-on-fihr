export default interface DatePeriod {
    readonly fom?: Date;
    readonly tom?: Date;
}

export const datePeriod = (start: Date | undefined, end: Date | undefined): DatePeriod => ({ fom: start, tom: end })

export const datePeriodsEqual = (a: DatePeriod | undefined, b: DatePeriod | undefined): boolean =>
    a === b ||
    (a?.fom?.getTime() === b?.fom?.getTime() && a?.tom?.getTime() === b?.tom?.getTime())