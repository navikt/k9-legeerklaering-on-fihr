import { NextRequest, NextResponse } from "next/server";
import { searchParametersFromUrl } from "@/app/api/diagnosekoder/DiagnosekodeSearchParameters";
import { DiagnosekodeSearcher, ICD10 } from '@navikt/diagnosekoder';
import { logRequest, logResponse } from '@/utils/loggerUtils';

/**
 * We want to chache these responses for a long time (3 hours), since the data should only change once a year.
 * @param res Response object to add cache header to.
 */
const addCacheHeader = (res: NextResponse): NextResponse => {
    res.headers.set("Cache-Control", "public, s-maxage=10800, maxage=10800, stale-while-revalidate=3600, stale-if-error=3600")
    return res;
}

const searcher = new DiagnosekodeSearcher(ICD10, 100);

/**
 * Searches through the diagnosekoder json and returns a limited result set. The select dialog for diagnosekoder
 * uses this, both to show a initial limited result when there is no search text, and showing the result after the user
 * has entered a search query.
 */
export const GET = (request: NextRequest): NextResponse => {
    logRequest(request);
    const {searchText, pageNumber} = searchParametersFromUrl(request.nextUrl);
    const searchResult = searcher.search(searchText, pageNumber);
    const response = NextResponse.json(searchResult);
    logResponse(request.nextUrl, response)
    return addCacheHeader(response)
}
