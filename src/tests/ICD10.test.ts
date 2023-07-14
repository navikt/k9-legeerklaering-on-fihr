import { describe, expect, test } from '@jest/globals';
import {Diagnosekode, diagnosekoder, searchDiagnosekoder} from "@/app/api/diagnosekoder/ICD10";

const a001: Diagnosekode = {code: 'A001', text: "Kolera som skyldes Vibrio cholerae 01, biovar eltor"};
const v4n4r: Diagnosekode = {code: 'V4n4r', text: "Tr.uly bil;skole m.v;Annen aktivitet"};

const b16Results = [
    {code: 'B160', text: 'Akutt hepatitt B med delta-agens (koinfeksjon) og leverkoma'},
    {code: 'B161', text: 'Akutt hepatitt B med delta-agens (koinfeksjon) u. leverkoma'},
    {code: 'B162', text: 'Akutt hepatitt B uten delta-agens med leverkoma'},
    {code: 'B169', text: 'Akutt hepatitt B uten deltavirus og uten leverkoma'},
]

describe('ICD10 search', () => {
    test('with code A001 should return a single correct result', () => {
        const result = searchDiagnosekoder('A001');
        expect(result).toHaveLength(1);
        expect(result).toEqual([a001])
    })
    test('with code a001 should return a single correct result', () => {
        const result = searchDiagnosekoder('a001');
        expect(result).toHaveLength(1);
        expect(result).toEqual([a001])
    })
    test('with code V4N4R should return a single correct result', () => {
        const result = searchDiagnosekoder('V4N4R');
        expect(result).toHaveLength(1);
        expect(result).toEqual([v4n4r])
    })
    test('with code v4n4r should return a single correct result', () => {
        const result = searchDiagnosekoder('v4n4r');
        expect(result).toHaveLength(1);
        expect(result).toEqual([v4n4r])
    })
    test('with search text b16 should return 4 results', () => {
        const result = searchDiagnosekoder('b16')
        expect(result).toHaveLength(4)
        expect(result).toEqual(b16Results)
    })
    test('with empty search text should return all results', () => {
        expect(searchDiagnosekoder('')).toHaveLength(diagnosekoder.length)
    })
})
