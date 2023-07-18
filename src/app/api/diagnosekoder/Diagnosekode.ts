export interface Diagnosekode {
    readonly code: string;
    readonly text: string;
}

export const instanceOfDiagnosekode = (obj: any): obj is Diagnosekode =>
    'code' in obj && 'text' in obj &&
    typeof obj.code === 'string' &&
    typeof obj.text === 'string';

export const instanceOfDiagnosekodeArray = (arr: any): arr is Diagnosekode[] => arr instanceof Array && (
    arr.length === 0 || instanceOfDiagnosekode(arr[0])
)
