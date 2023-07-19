import validateRoute from "@/utils/validateRoute";
import {
    DiagnosekodeSearchResult,
    instanceOfDiagnosekodeSearchResult
} from "@/app/api/diagnosekoder/DiagnosekodeSearchResult";
import {searchParametersToUrl} from "@/app/api/diagnosekoder/DiagnosekodeSearchParameters";


export const diagnosekoderApiPath = validateRoute('/api/diagnosekoder');


export const searchDiagnosekoderFetch = async (searchText: string, pageNumber: number, abortSignal: AbortSignal): Promise<DiagnosekodeSearchResult> => {
    const baseUrl = new URL(window.location.origin);
    const url = searchParametersToUrl(
        new URL(diagnosekoderApiPath, baseUrl),
        {searchText, pageNumber}
    );
    const resp = await fetch(url.toString(), {signal: abortSignal})
    if (resp.ok) {
        const data = await resp.json()
        if (instanceOfDiagnosekodeSearchResult(data)) {
            return data;
        } else {
            const someData = JSON.stringify(data).substring(0, 80)
            throw new Error(`json returned from fetch call did not match expected DiagnosekodeSearchResult interface. (${someData})`)
        }
    } else {
        throw new Error(`Unexpected status code when fetching diagnosekoder (${resp.status} - ${resp.statusText})`)
    }
}


