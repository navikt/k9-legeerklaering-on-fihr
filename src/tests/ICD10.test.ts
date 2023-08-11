import { describe, expect, test } from '@jest/globals';
import {instanceOfDiagnosekodeArray} from "@/app/api/diagnosekoder/Diagnosekode";
import {ICD10, instanceOfDiagnosekode} from '@navikt/diagnosekoder'

describe('ICD10', () => {
    test('must assert to correct type', () => {
        expect(instanceOfDiagnosekodeArray(ICD10)).toBe(true)
        expect(ICD10.length).toBeGreaterThan(10_000);
        for(const dk of ICD10) {
            expect(instanceOfDiagnosekode(dk)).toBe(true)
        }
    })
})
