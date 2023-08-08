import Diagnosekode, {instanceOfDiagnosekode} from "@navikt/diagnosekoder/Diagnosekode";

export interface DiagnosekodeSearchResult {
    readonly diagnosekoder: Diagnosekode[];
    readonly pageNumber: number;
    readonly hasMore: boolean;
}

const instanceOfDiagnosekodeArray = (arr: any): arr is Diagnosekode[] =>
    arr instanceof Array && (arr.length === 0 || instanceOfDiagnosekode(arr[0]))

export const instanceOfDiagnosekodeSearchResult = (some: any): some is DiagnosekodeSearchResult =>
    'diagnosekoder' in some &&
    instanceOfDiagnosekodeArray(some.diagnosekoder) &&
    'hasMore' in some
