"use client"

import {Alert, Button, Search, Table} from "@navikt/ds-react";
import {Diagnosekode} from "@/app/api/diagnosekoder/ICD10";
import {
    ForwardedRef,
    forwardRef,
    KeyboardEvent,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import {DiagnosekodeSearchResult, pageSize, searchDiagnosekoderFetch} from "@/app/api/diagnosekoder/api";
import {ArrowRightIcon, ChevronDownDoubleIcon} from '@navikt/aksel-icons';

import diagnosekoderCss from './diagnosekoder.module.css';

interface DiagnosekoderProp {
    readonly diagnosekoder: Diagnosekode[];
}

export interface OnSelectedDiagnose {
    readonly onSelectedDiagnose?: (diagnosekode: Diagnosekode) => void;
}

const noop = () => void 0;

const DiagnosekodeRow = ({code, text, onSelectedDiagnose}: Diagnosekode & OnSelectedDiagnose) => {
    const handleSelected = onSelectedDiagnose ?
            () => onSelectedDiagnose({code, text}) :
            noop;
    // Parent component DiagnosekodeTable depends somewhat on the html structure here, by using css queries.
    // Take care not to change this html without looking at the DiagnosekodeTable css queries.
    return (
        <Table.Row onClick={(ev) => {ev.stopPropagation(); handleSelected()}} className={diagnosekoderCss.diagnosekoderow}>
            <Table.DataCell>{code}</Table.DataCell>
            <Table.DataCell>{text}</Table.DataCell>
            <Table.DataCell>
                <Button
                    onClick={(ev) => {ev.stopPropagation(); handleSelected()}}
                    variant="tertiary"
                    size="small"
                    aria-label="Velg"
                    icon={<ArrowRightIcon aria-hidden />}>
                </Button>
            </Table.DataCell>
        </Table.Row>
    )
}

const DiagnosekodeRows = ({diagnosekoder, onSelectedDiagnose}: DiagnosekoderProp & OnSelectedDiagnose) => {
    return diagnosekoder.map(diagnosekode => <DiagnosekodeRow key={diagnosekode.code} {...diagnosekode} onSelectedDiagnose={onSelectedDiagnose} />)
}

const FetchDiagnosekoderErrorAlert = ({error}: {error: Error}) => {
    return (
        <Alert className="my-4" variant="error">
            <p>Søk etter diagnosekode feilet. Prøv igjen.</p>
            <p>
                <small>{error.message}</small>
            </p>
        </Alert>
    )
}

export interface DiagnosekodeTableProps extends DiagnosekoderProp, OnSelectedDiagnose {
    onKeyDown?(event: KeyboardEvent<HTMLTableElement>): void;
}

export interface DiagnosekodeTableMethods {
    /**
     * Used by parent component when it wants to focus the "select" button of the first row in the search result table.
     */
    focusFirst(): void;

    /**
     * Used by parent component when it wants to focus the "select" button of the next row in the search result table.
     *
     * This assumes that a "select" button in the table currently has focus. If no button has focus, it will call focusFirst().
     */
    focusNext(): void;

    /**
     * Used by parent component when it wants to focus the "select" button of previous row in the search result table.
     *
     * If there is no focuse row, or no row above currently focused row, nothing is done.
     */
    focusPrevious(): void;
}

const DiagnosekodeTable = forwardRef(({diagnosekoder, onSelectedDiagnose, onKeyDown}: DiagnosekodeTableProps, ref: ForwardedRef<DiagnosekodeTableMethods>) => {
    // The ref and css selector stuff here depends on the html structure of the subcomponents used (DiagnosekodeRows, ...).
    // So we must take care not to break this. Could probably avoid the fragility by pushing using more refs and imperative
    // handlers further down the component chain, but don't want to spend time doing that atm.
    const tableRef = useRef<HTMLTableElement>(null);
    useImperativeHandle(ref, () => {
        const rowWithFocusedButton = () => tableRef.current?.querySelector("tr:has(button:focus)");
        const noButtonHasFocus = () => rowWithFocusedButton() === null;
        return {
            focusFirst() {
                const button = tableRef.current?.querySelector("button");
                button?.focus();
            },
            focusNext() {
                const nextButton = tableRef.current?.querySelector<HTMLButtonElement>("tr:has(button:focus) + tr button");
                if (nextButton) {
                    nextButton.focus();
                } else if(noButtonHasFocus()) {
                    this.focusFirst();
                }
            },
            focusPrevious() {
                const focusedRow = rowWithFocusedButton();
                const prevRowButton = focusedRow?.previousElementSibling?.querySelector("button");
                prevRowButton?.focus();
            }
        }
    }, [tableRef]);

    return (
        <Table ref={tableRef} onKeyDown={onKeyDown}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Kode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <DiagnosekodeRows diagnosekoder={diagnosekoder} onSelectedDiagnose={onSelectedDiagnose} />
            </Table.Body>
        </Table>
    )
})
DiagnosekodeTable.displayName = "DiagnosekodeTable"

const emptySearchResult: DiagnosekodeSearchResult = {
    diagnosekoder: [],
    pageNumber: 0,
    foundCount: 0
};

interface SearchParams {
    readonly searchText: string;
    readonly pageNumber: number;
}

const initSearchParams: SearchParams = {
    searchText: "",
    pageNumber: 1,
}

const keycodes = {
    ArrowDown: 'ArrowDown',
    ArrowUp: 'ArrowUp',
}

const DiagnosekodeSearch = ({onSelectedDiagnose}: OnSelectedDiagnose) => {
    const [searchParams, setSearchParams] = useState(initSearchParams)
    const [searchResult, setSearchResult] = useState<DiagnosekodeSearchResult>(emptySearchResult)
    const [error, setError] = useState<Error | null>(null)
    const diagnosekodeTableRef = useRef<DiagnosekodeTableMethods>(null)

    const trimmedSearchText = searchParams.searchText.trim(); // No point in doing a new search if user just adds/removes a space
    const pageNumber = searchParams.pageNumber;

    useEffect(() => {
        let isSubscribed = true;
        // TODO AbortController for the fetch?
        const fetchDiagnosekoder = async (): Promise<void> => {
            const searchResult = await searchDiagnosekoderFetch(trimmedSearchText, pageNumber);
            if (isSubscribed) {
                if (pageNumber > 1) {
                    // The search result is a paging continuation, add it to the existing result
                    setSearchResult(existing =>
                        ({
                            diagnosekoder: [...existing.diagnosekoder, ...searchResult.diagnosekoder],
                            pageNumber: searchResult.pageNumber,
                            foundCount: searchResult.foundCount,
                        })
                    );
                } else { // Search result is a new first page result
                    setSearchResult(searchResult)
                }
            }// else another fetch has been started, ignore this
        };

        fetchDiagnosekoder()
            .then(
                () => {
                    setError(null)
                } , err => {
                    if(err instanceof Error) {
                        setError(err)
                    } else {
                        setError(new Error(err))
                    }
                }
            )
        return () => {
            isSubscribed = false;
        };
    }, [trimmedSearchText, pageNumber])

    const handleSearchChanged = useCallback((searchText: string) => setSearchParams({searchText, pageNumber: initSearchParams.pageNumber}), [])
    const handleShowMoreClicked = useCallback(() => setSearchParams({searchText: trimmedSearchText, pageNumber: pageNumber + 1}), [trimmedSearchText, pageNumber])
    const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if (searchResult.diagnosekoder.length === 1 && onSelectedDiagnose !== undefined) {
                onSelectedDiagnose(searchResult.diagnosekoder[0]);
            }
        } else if (event.code === keycodes.ArrowDown && searchResult.diagnosekoder.length > 0) {
            // Focus the first choose button in search result list
            diagnosekodeTableRef.current?.focusFirst();
        }
    }, [onSelectedDiagnose, searchResult])

    const handleDiagnosekodeTableKeyDown = (ev: KeyboardEvent<HTMLTableElement>) => {
        if (ev.code === keycodes.ArrowDown) { // arrow down was pressed while in the table, focus the next select button, if possible.
            diagnosekodeTableRef.current?.focusNext();
        } else if (ev.code === keycodes.ArrowUp) {
            diagnosekodeTableRef.current?.focusPrevious();
        }
    }

    const resultElements = error ?
        <FetchDiagnosekoderErrorAlert error={error} /> :
        <DiagnosekodeTable
            ref={diagnosekodeTableRef}
            diagnosekoder={searchResult.diagnosekoder}
            onSelectedDiagnose={onSelectedDiagnose}
            onKeyDown={handleDiagnosekodeTableKeyDown}
        />;

    const showMoreElements = searchResult.foundCount > searchResult.pageNumber * pageSize ?
        <div className="flex justify-center py-4">
            <Button onClick={handleShowMoreClicked} variant="tertiary" icon={<ChevronDownDoubleIcon aria-hidden />}>Vis flere rader</Button>
        </div> :
        null;

    return (
        <>
                <Search
                    autoFocus
                    label="Søk med kode eller beskrivelse"
                    onChange={handleSearchChanged}
                    onKeyUp={handleKeyUp}
                    variant="simple"
                    clearButton={false}
                    className={diagnosekoderCss.searchinput}
                    placeholder="Søk (kode eller beskrivelse)"
                />
                <div className={diagnosekoderCss.searchresult}>
                    {resultElements}
                    {showMoreElements}
                </div>
        </>
    )
}

export default DiagnosekodeSearch;