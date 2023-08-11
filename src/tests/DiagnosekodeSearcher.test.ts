import type {Diagnosekode} from "@/app/api/diagnosekoder/Diagnosekode";
import {DiagnosekodeSearcher} from "@/app/api/diagnosekoder/DiagnosekodeSearcher";
import {expect, test} from "@jest/globals";
import {icd10Diagnosekoder} from "@/app/api/diagnosekoder/ICD10";

export const fakeDiagnosekoder: Diagnosekode[] = [
    {"code":"A000","text":"Diagnose 1"},
    {"code":"A001","text":"Diagnose 2"},
    {"code":"A002","text":"Diagnose 3"},
    {"code":"A010","text":"Diagnose 4"},
    {"code":"C011","text":"Diagnose 5"},
    {"code":"v201","text":"Diagnose 6"},
    {"code":"v230","text":"Diagnose 7"},
]


describe("DiagnosekodeSearcher with given mock input", () => {
    const searcher = new DiagnosekodeSearcher(fakeDiagnosekoder, 3);
    test("should give pagesize inital elements from all with empty search", () => {
        expect(searcher.search("", 1)).toEqual({
            diagnosekoder: fakeDiagnosekoder.slice(0, searcher.pageSize),
            pageNumber: 1,
            hasMore: true,
        })
    })

    test("should give correct result with code search", () => {
        expect(searcher.search("a00", 1)).toEqual({
            diagnosekoder: fakeDiagnosekoder.slice(0, 3),
            pageNumber: 1,
            hasMore: false,
        })
    })
})

describe("DiagnosekodeSearcher with ICD10 input", () => {
    const a001: Diagnosekode = {code: 'A001', text: "Kolera som skyldes Vibrio cholerae 01, biovar eltor"};
    const v4n4r: Diagnosekode = {code: 'V4n4r', text: "Tr.uly bil;skole m.v;Annen aktivitet"};

    const b16Results = [
        {code: 'B160', text: 'Akutt hepatitt B med delta-agens (koinfeksjon) og leverkoma'},
        {code: 'B161', text: 'Akutt hepatitt B med delta-agens (koinfeksjon) u. leverkoma'},
        {code: 'B162', text: 'Akutt hepatitt B uten delta-agens med leverkoma'},
        {code: 'B169', text: 'Akutt hepatitt B uten deltavirus og uten leverkoma'},
    ];
    const searcher = new DiagnosekodeSearcher(icd10Diagnosekoder, 100);
    test('with code A001 should return a single correct result', () => {
        const result = searcher.search('A001', 1);
        expect(result.diagnosekoder).toHaveLength(1);
        expect(result.diagnosekoder).toEqual([a001])
    })
    test('with code a001 should return a single correct result', () => {
        const result = searcher.search('a001', 1);
        expect(result.diagnosekoder).toHaveLength(1);
        expect(result.diagnosekoder).toEqual([a001])
    })
    test('with code V4N4R should return a single correct result', () => {
        const result = searcher.search('V4N4R', 1);
        expect(result.diagnosekoder).toHaveLength(1);
        expect(result.diagnosekoder).toEqual([v4n4r])
    })
    test('with code v4n4r should return a single correct result', () => {
        const result = searcher.search('v4n4r', 1);
        expect(result.diagnosekoder).toHaveLength(1);
        expect(result.diagnosekoder).toEqual([v4n4r])
    })
    test('with search text b16 should return 4 results', () => {
        const result = searcher.search('b16', 1);
        expect(result.diagnosekoder).toHaveLength(4)
        expect(result.diagnosekoder).toEqual(b16Results)
    })
    test('with empty search text should return all results', () => {
        expect(searcher.search('', 1).diagnosekoder).toHaveLength(searcher.pageSize)
    })
})
