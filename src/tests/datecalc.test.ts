import {addOneDay, dayCount} from "@/utils/datecalc";


describe('dayCount', () => {
    interface TestCase {
        readonly start: Date | undefined;
        readonly end: Date | undefined;
        readonly expectDayCount: number;
        readonly testname: string;
    }

    const testCases: TestCase[] = [
        {start: undefined, end: new Date("2023-07-01"), expectDayCount: 0, testname: "start undefined"},
        {start: new Date("2023-07-01"), end: undefined, expectDayCount: 0, testname: "end undefined"},
        {start: undefined, end: undefined, expectDayCount: 0, testname: "begge undefined"},
        {start: new Date("2023-02-01"), end: new Date("2023-03-01"), expectDayCount: 28, testname: "februar 2023"},
        {start: new Date("2024-02-01"), end: new Date("2024-03-01"), expectDayCount: 29, testname: "februar 2024"},
        {start: new Date("2023-03-24"), end: new Date("2023-03-27"), expectDayCount: 3, testname: "sommertidskifte 2023"},
        {start: new Date("2022-12-31"), end: new Date("2023-01-01"), expectDayCount: 1, testname: "årskifte 2023"},
        {start: new Date("2023-07-01"), end: new Date("2023-07-01"), expectDayCount: 0, testname: "samme start og slutt"},
    ]

    for(const {testname, start, end, expectDayCount} of testCases) {
        test(testname, () => expect(dayCount(start, end)).toEqual(expectDayCount))
    }
});

describe('addOneDay', () => {
    test('inputting undefined should return undefined', () => {
        expect(addOneDay(undefined)).toBeUndefined()
    })
    test('should return new instance, not mutating the input date', () => {
        const inputDate = new Date()
        const result = addOneDay(inputDate)
        expect(result).not.toBe(inputDate)
    })
    const addOneTestCases = [
        {inputDate: new Date("2023-03-14"), expectDate: new Date("2023-03-15")},
        {inputDate: new Date("2023-02-28"), expectDate: new Date("2023-03-01")},
        {inputDate: new Date("2024-02-28"), expectDate: new Date("2024-02-29")},
        {inputDate: new Date("2023-12-31"), expectDate: new Date("2024-01-01")},
    ]
    for(const {inputDate, expectDate} of addOneTestCases) {
        test(`add one to ${inputDate.toDateString()}`, () => {
            expect(addOneDay(inputDate)).toEqual(expectDate)
        })
    }
})
