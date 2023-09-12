import {expect, test} from "@jest/globals";
import {
    DiagnosekodeSearchParameters, searchParametersFromUrl,
    searchParametersToUrl
} from "@/app/api/diagnosekoder/DiagnosekodeSearchParameters";

describe("searchParameters To and From Url functions", () => {
    const baseUrl = new URL("http://localhost");
    test("from url should give default values for empty input", () => {
        expect(searchParametersFromUrl(baseUrl)).toEqual({searchText: '', pageNumber: 1})
    })
    test("to/from roundtrip should give correct searchText and pageNumber when specified", () => {
        const input: DiagnosekodeSearchParameters = {searchText: "A000", pageNumber: 2};
        expect(searchParametersFromUrl(searchParametersToUrl(baseUrl, input))).toEqual(input)
    })
})
