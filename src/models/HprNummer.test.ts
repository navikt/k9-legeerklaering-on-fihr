/**
 * @jest-environment node
 */

import { isHprNumber } from "@/models/HprNumber";

describe("HprNummer", () => {
    const hprNumbers = ["22", "111222"]
    for(const hprNumber of hprNumbers) {
        test(`type check with valid input ${hprNumber} should return true`, () => {
            expect(isHprNumber(hprNumber)).toBe(true)
        })
    }
})