import {dateTimePeriodResolver, dateTimeResolver, isDateWithinPeriod} from "@/integrations/fhir/resolvers";
import {IPeriod} from "@ahryman40k/ts-fhir-types/lib/R4";
import DatePeriod, {datePeriod} from "@/models/DatePeriod";

describe(`fhir dateTime resolver`, () => {
    const validTestcases = {
        "2023-04-01T01:02:03+02:00": new Date("2023-04-01T01:02:03+02:00"),
        "2023-04-01": new Date("2023-04-01T00:00:00Z"),
        "2023-04": new Date("2023-04-01T00:00:00Z"),
        "2023": new Date("2023-01-01T00:00:00Z"),
    }

    test(`valid inputs should resolve to expected Date`, () => {
        for(const [input, expected] of Object.entries(validTestcases)) {
            expect(dateTimeResolver(input)).toEqual(expected)
        }
    })
})

describe('fhir dateTimePeriodResolver', () => {
    type TestCase = {
        input: IPeriod,
        expected: DatePeriod,
    }
    const inputIPeriod = (start?: string, end?: string): IPeriod => ({start, end})
    const validTestcases: TestCase[] = [
        {
            input: inputIPeriod("2023-04-01T12:23:00+02:00", "2023-05-12"),
            expected: {start: new Date("2023-04-01T12:23:00+02:00"), end: new Date("2023-05-12")}
        },
        {
            input: inputIPeriod("2023-04-01T12:23:00+02:00", undefined),
            expected: {start: new Date("2023-04-01T12:23:00+02:00")}
        },
    ]
    test(`valid inputs should resolve to expected period`, () => {
        for(const testCase of validTestcases) {
            expect(dateTimePeriodResolver(testCase.input)).toEqual(testCase.expected)
        }
    })
});

describe('fhir isDateWithinPeriod', () => {
    test('with both start and end specified should work', () => {
        const period = datePeriod(new Date("2021-04-02"), new Date("2021-04-05"))
        const before = new Date("2021-04-01")
        const within = new Date("2021-04-03")
        const after = new Date("2021-04-06")
        expect(isDateWithinPeriod(before, period)).toBe(false)
        expect(isDateWithinPeriod(within, period)).toBe(true)
        expect(isDateWithinPeriod(after, period)).toBe(false)
        expect(isDateWithinPeriod(period.start!, period)).toBe(true)
        expect(isDateWithinPeriod(period.end!, period)).toBe(true)
    })
    test('without end should work', () => {
        const period = datePeriod(new Date("2021-04-02"), undefined)
        const before = new Date("2021-04-01")
        const within = new Date("2021-04-03")
        expect(isDateWithinPeriod(before, period)).toBe(false)
        expect(isDateWithinPeriod(within, period)).toBe(true)
        expect(isDateWithinPeriod(period.start!, period)).toBe(true)
    })
    test('with undefined start always results in undefined', () => {
        const period = datePeriod(undefined, new Date())
        const before = new Date("2021-04-01")
        expect(isDateWithinPeriod(before, period)).toBeUndefined()
        expect(isDateWithinPeriod(period.end!, period)).toBeUndefined()
    })
})