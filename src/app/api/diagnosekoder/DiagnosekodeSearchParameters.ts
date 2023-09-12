export interface DiagnosekodeSearchParameters {
    readonly searchText: string;
    readonly pageNumber: number;
}

const search = "search";
const page = "page";

export const searchParametersToUrl = (baseURL: URL, params: DiagnosekodeSearchParameters): URL => {
    const url = new URL(baseURL);
    if(params.searchText.length > 0) {
        url.searchParams.append(search, params.searchText)
    }
    url.searchParams.append(page, params.pageNumber.toString());
    return url;
}

export const searchParametersFromUrl = (url: URL): DiagnosekodeSearchParameters => {
    const searchText = url.searchParams.get(search) || '';
    const pageNumber = Number(url.searchParams.get(page)) || 1;
    return {searchText, pageNumber};
}
