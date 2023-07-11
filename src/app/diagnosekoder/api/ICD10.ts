import ICD10 from './ICD10.json';

export interface Diagnosekode {
    readonly code: string;
    readonly text: string;
}

/**
 * We add an uppercased text for doing case-insensitive search.
 */
export interface DiagnosekodeWithUppercased extends Diagnosekode {
    readonly uppercasedCode: string;
    readonly uppercasedText: string;
}

export const instanceOfDiagnosekode = (obj: any): obj is Diagnosekode => 'code' in obj && 'text' in obj;

export const instanceOfDiagnosekodeArray = (arr: any): arr is Diagnosekode[] => arr instanceof Array && (
    arr.length === 0 || instanceOfDiagnosekode(arr[0])
)

export const diagnosekoder: Diagnosekode[] = ICD10;

export const diagnosekoderWithUppercased: DiagnosekodeWithUppercased[] =
    diagnosekoder.map(dk => ({...dk, uppercasedCode: dk.code.toUpperCase(), uppercasedText: dk.text.toUpperCase()}))

export const searchDiagnosekoder = (searchText: string): Diagnosekode[] => {
    const searchTextUppercased = searchText.trim().toUpperCase()
    return diagnosekoderWithUppercased.filter(diagnosekode => {
        return  diagnosekode.uppercasedCode.includes(searchTextUppercased) || diagnosekode.uppercasedText.includes(searchTextUppercased)
    }).map(dk => ({code: dk.code, text: dk.text}));
}
