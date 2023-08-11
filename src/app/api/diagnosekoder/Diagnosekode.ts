import {type Diagnosekode, instanceOfDiagnosekode} from '@navikt/diagnosekoder';

export const instanceOfDiagnosekodeArray = (arr: any): arr is Diagnosekode[] => arr instanceof Array && (
    arr.length === 0 || instanceOfDiagnosekode(arr[0])
)
