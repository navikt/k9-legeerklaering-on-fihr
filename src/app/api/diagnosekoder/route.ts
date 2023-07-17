import {NextRequest, NextResponse} from "next/server";
import {diagnosekoder, searchDiagnosekoder} from "@/app/api/diagnosekoder/ICD10";
import {pageSize, DiagnosekodeSearchResult} from "@/app/api/diagnosekoder/api";

/**
 * We want to chache these responses for a long time (3 hours), since the data should only change once a year.
 * @param res Response object to add cache header to.
 */
const addCacheHeader = (res: NextResponse): NextResponse => {
    res.headers.set("Cache-Control", "public, s-maxage=10800, maxage=10800, stale-while-revalidate=3600, stale-if-error=3600")
    return res;
}

/**
 * Searches through the diagnosekoder json and returns a limited result set. The select dialog for diagnosekoder
 * uses this, both to show a initial limited result when there is no search text, and showing the result after the user
 * has entered a search query.
 */
export const GET = (request: NextRequest): NextResponse => {
    const searchText = request.nextUrl.searchParams.get("search") || '';
    const pageNumber = Number(request.nextUrl.searchParams.get("page")) || 1;
    const sliceStart = (pageNumber - 1) * pageSize;
    const sliceEnd = sliceStart + pageSize;
    if (searchText.length === 0) {
        const found = diagnosekoder.slice(sliceStart, sliceEnd);
        const res = NextResponse.json<DiagnosekodeSearchResult>({
            diagnosekoder: found,
            pageNumber,
            foundCount: diagnosekoder.length,
        })
        return addCacheHeader(res)
    } else {
        const found = searchDiagnosekoder(searchText);
        const res = NextResponse.json<DiagnosekodeSearchResult>({
            diagnosekoder: found.slice(sliceStart, sliceEnd),
            pageNumber: pageNumber,
            foundCount: found.length,
        });
        return addCacheHeader(res)
    }
}