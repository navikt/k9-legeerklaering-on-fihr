import {NextRequest, NextResponse} from "next/server";
import {icd10Diagnosekoder} from "@/app/api/diagnosekoder/ICD10";
import {DiagnosekodeSearcher} from "@/app/api/diagnosekoder/DiagnosekodeSearcher";
import {searchParametersFromUrl} from "@/app/api/diagnosekoder/DiagnosekodeSearchParameters";

/**
 * We want to chache these responses for a long time (3 hours), since the data should only change once a year.
 * @param res Response object to add cache header to.
 */
const addCacheHeader = (res: NextResponse): NextResponse => {
    res.headers.set("Cache-Control", "public, s-maxage=10800, maxage=10800, stale-while-revalidate=3600, stale-if-error=3600")
    return res;
}

const searcher = new DiagnosekodeSearcher(icd10Diagnosekoder, 100);

/**
 * Searches through the diagnosekoder json and returns a limited result set. The select dialog for diagnosekoder
 * uses this, both to show a initial limited result when there is no search text, and showing the result after the user
 * has entered a search query.
 */
export const GET = (request: NextRequest): NextResponse => {
    const {searchText, pageNumber} = searchParametersFromUrl(request.nextUrl);
    const searchResult = searcher.search(searchText, pageNumber);
    return addCacheHeader(NextResponse.json(searchResult))
}