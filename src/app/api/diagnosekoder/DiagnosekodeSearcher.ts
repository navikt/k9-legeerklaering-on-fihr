import type {Diagnosekode} from "@/app/api/diagnosekoder/Diagnosekode";
import type {DiagnosekodeSearchResult} from "@/app/api/diagnosekoder/DiagnosekodeSearchResult";

/**
 * We add an uppercased text for doing case-insensitive search.
 */
export interface DiagnosekodeWithUppercased extends Diagnosekode {
    readonly uppercasedCode: string;
    readonly uppercasedText: string;
}


/**
 * Helper class that provides case-insensitive search of given diagnosekoder array.
 */
export class DiagnosekodeSearcher {
    public readonly diagnosekoderWithUppercased: DiagnosekodeWithUppercased[];

    public constructor(
        public readonly diagnosekoder: Diagnosekode[],
        public readonly pageSize: number,
    ) {
        this.diagnosekoderWithUppercased = this.diagnosekoder.map(dk =>
            ({...dk, uppercasedCode: dk.code.toUpperCase(), uppercasedText: dk.text.toUpperCase()})
        );
    }

    /**
     * Case-insensitive search of diagnosekoder with given searchText.
     *
     * This returns diagnosekode entries that includes searchText either in code or text props.
     *
     * If searchText is empty, the first <pageSize> number of diagnosekoder is returned.
     * @param searchText
     * @param pageNumber
     */
    public search(searchText: string, pageNumber: number): DiagnosekodeSearchResult {
        const sliceStart = (pageNumber - 1) * this.pageSize;
        const sliceEnd = sliceStart + this.pageSize;
        if (searchText.length === 0) {
            return {
                diagnosekoder: this.diagnosekoder.slice(sliceStart, sliceEnd),
                pageNumber,
                hasMore: this.diagnosekoder.length > pageNumber * this.pageSize,
            };
        } else {
            const searchTextUppercased = searchText.trim().toUpperCase()
            const found = this.diagnosekoderWithUppercased.filter(diagnosekode => {
                return  diagnosekode.uppercasedCode.includes(searchTextUppercased) || diagnosekode.uppercasedText.includes(searchTextUppercased)
            }).map(dk => ({code: dk.code, text: dk.text}));
            return {
                diagnosekoder: found.slice(sliceStart, sliceEnd),
                pageNumber: pageNumber,
                hasMore: found.length > pageNumber * this.pageSize,
            };
        }
    }
}