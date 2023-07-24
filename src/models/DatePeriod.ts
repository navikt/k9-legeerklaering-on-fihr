export default interface DatePeriod {
    readonly start?: Date;
    readonly end?: Date;
}

export const datePeriod = (start: Date | undefined, end: Date | undefined): DatePeriod => ({ start, end })