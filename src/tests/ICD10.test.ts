import { describe, expect, test } from '@jest/globals';
import {icd10Diagnosekoder} from "@/app/api/diagnosekoder/ICD10";
import {instanceOfDiagnosekode, instanceOfDiagnosekodeArray} from "@/app/api/diagnosekoder/Diagnosekode";

describe('ICD10', () => {
    test('must assert to correct type', () => {
        expect(instanceOfDiagnosekodeArray(icd10Diagnosekoder)).toBe(true)
        expect(icd10Diagnosekoder.length).toBeGreaterThan(10_000);
        for(const dk of icd10Diagnosekoder) {
            expect(instanceOfDiagnosekode(dk)).toBe(true)
        }
    })
})
