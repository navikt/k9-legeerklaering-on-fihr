import {NextRequest, NextResponse} from "next/server";
import {diagnosekoder, searchDiagnosekoder} from "@/app/api/diagnosekoder/ICD10";
import {pageSize, DiagnosekodeSearchResult} from "@/app/api/diagnosekoder/api";


export const GET = (request: NextRequest): NextResponse => {
    const searchText = request.nextUrl.searchParams.get("search") || '';
    const pageNumber = Number(request.nextUrl.searchParams.get("page")) || 1;
    const sliceStart = (pageNumber - 1) * pageSize;
    const sliceEnd = sliceStart + pageSize;
    if (searchText.length === 0) {
        const found = diagnosekoder.slice(sliceStart, sliceEnd);
        return NextResponse.json<DiagnosekodeSearchResult>({
            diagnosekoder: found,
            pageNumber,
            foundCount: diagnosekoder.length,
        })
    } else {
        const found = searchDiagnosekoder(searchText);
        return NextResponse.json<DiagnosekodeSearchResult>({
            diagnosekoder: found.slice(sliceStart, sliceEnd),
            pageNumber: pageNumber,
            foundCount: found.length,
        });
    }
}