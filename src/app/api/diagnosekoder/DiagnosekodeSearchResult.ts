import {Diagnosekode} from "@/app/api/diagnosekoder/Diagnosekode";
import {instanceOfDiagnosekodeArray} from "@/app/api/diagnosekoder/Diagnosekode";

export interface DiagnosekodeSearchResult {
    readonly diagnosekoder: Diagnosekode[];
    readonly pageNumber: number;
    readonly hasMore: boolean;
}

export const instanceOfDiagnosekodeSearchResult = (some: any): some is DiagnosekodeSearchResult =>
    'diagnosekoder' in some &&
    instanceOfDiagnosekodeArray(some.diagnosekoder) &&
    'hasMore' in some
