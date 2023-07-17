import validateRoute from "@/utils/validateRoute";
import type {Diagnosekode} from "@/app/api/diagnosekoder/ICD10";
import {instanceOfDiagnosekodeArray} from "@/app/api/diagnosekoder/ICD10";

export const diagnosekoderApiPath = validateRoute('/api/diagnosekoder');
export const pageSize = 100;

export interface DiagnosekodeSearchResult {
    readonly diagnosekoder: Diagnosekode[];
    readonly pageNumber: number;
    readonly foundCount: number;
}

export const instanceOfDiagnosekodeSearchResult = (some: any): some is DiagnosekodeSearchResult =>
    'diagnosekoder' in some &&
    instanceOfDiagnosekodeArray(some.diagnosekoder) &&
    'foundCount' in some

export const searchDiagnosekoderFetch = async (searchText: string, pageNumber: number, abortSignal: AbortSignal): Promise<DiagnosekodeSearchResult> => {
    const url = new URL(diagnosekoderApiPath, window.location.origin)
    if(searchText.length > 0) {
        url.searchParams.append("search", searchText)
    }
    url.searchParams.append("page", pageNumber.toString());
    const resp = await fetch(url.toString(), {signal: abortSignal})
    if (resp.ok) {
        const data = await resp.json()
        if (instanceOfDiagnosekodeSearchResult(data)) {
            return data;
        } else {
            throw new Error(`json returned from fetch call did not match expected DiagnosekodeSearchResult interface. (${data.substring(0, 30)})`)
        }
    } else {
        throw new Error(`Unexpected status code when fetching diagnosekoder (${resp.status} - ${resp.statusText})`)
    }
}