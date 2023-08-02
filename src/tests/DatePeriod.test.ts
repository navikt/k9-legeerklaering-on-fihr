import {datePeriod, datePeriodsEqual} from "@/models/DatePeriod";

const copyDate = (dt: Date): Date => {
    const newDt = new Date();
    newDt.setTime((dt.getTime()))
    return newDt;
}

describe("DatePeriodsEqual return value when", () => {
    const date1 = new Date("2023-8-1");
    const date2 = new Date("2023-8-20");
    const date3 = new Date("2023-8-30");
    const equalTestCases = [
        {
            msg: "both undefined",
            a: undefined,
            b: undefined,
        },
        {
            msg: "both start and end is undefined in both",
            a: datePeriod(undefined, undefined),
            b: datePeriod(undefined, undefined),
        },
        {
            msg: "start is undefined in both, end is the same instance",
            a: datePeriod(undefined, date1),
            b: datePeriod(undefined, date1),
        },
        {
            msg: "start is undefined in both, end is the same value",
            a: datePeriod(undefined, date1),
            b: datePeriod(undefined, copyDate(date1)),
        },
        {
            msg: "both has the same values",
            a: datePeriod(date1, date2),
            b: datePeriod(copyDate(date1), copyDate(date2)),
        },
        {
            msg: "one undefined, one filled with undefined",
            a: undefined,
            b: datePeriod(undefined, undefined)
        },
    ]
    for(const {msg, a, b} of equalTestCases) {
        test(msg, () => {
            expect(datePeriodsEqual(a, b)).toEqual(true)
        })
    }
    const unequalTestcases = [
        {
            msg: "one undefined, one filled with values",
            a: undefined,
            b: datePeriod(date1, date2),
        },
        {
            msg: "both defined, one with one undefined",
            a: datePeriod(date1, undefined),
            b: datePeriod(date1, date2),
        },
        {
            msg: "both defined, with one different value",
            a: datePeriod(date1, date2),
            b: datePeriod(date1, date3),
        }
    ]
    for(const {msg, a, b} of unequalTestcases) {
        test(msg, () => {
            expect(datePeriodsEqual(a, b)).toBe(false)
        })
    }
})