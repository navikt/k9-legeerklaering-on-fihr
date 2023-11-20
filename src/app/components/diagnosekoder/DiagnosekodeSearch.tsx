"use client"

import { Alert, Button, Loader, Search, Table } from "@navikt/ds-react";
import type { Diagnosekode, DiagnosekodeSearchResult, ICD10Diagnosekode } from "@navikt/diagnosekoder";
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
import { ArrowRightIcon, ChevronDownDoubleIcon } from '@navikt/aksel-icons';

import diagnosekoderCss from './diagnosekoder.module.css';
import dkCss from './diagnosekoder.module.css';
import debounce, { AbortedDebounce } from "@/utils/debounce";
import { searchDiagnosekoderFetch } from "@/app/api/diagnosekoder/client";
import { componentSize } from '@/utils/constants';

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
                    size={componentSize}
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
    readonly isLoading?: boolean;
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

const DiagnosekodeTable = forwardRef(({diagnosekoder, onSelectedDiagnose, onKeyDown, isLoading}: DiagnosekodeTableProps, ref: ForwardedRef<DiagnosekodeTableMethods>) => {
    const [isSlowLoading, setIsSlowLoading] = useState(false)

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

    // If table is loading, add a delayed set of the slow-loading flag, which will trigger the full loading indicator display after 150ms
    useEffect(() => {
        if (isLoading) {
            const timeoutId = window.setTimeout(() => {
                setIsSlowLoading(isLoading);
            }, 1500);
            return () => {
                window.clearTimeout(timeoutId);
            }
        } else {
            setIsSlowLoading(false)
        }
    }, [isLoading])

    return (
        <div>
            {isSlowLoading ? <Loader className={dkCss.centerOverlay} variant="neutral" size="3xlarge" title="Laster søkeresultat" /> : null}
            <Table size={componentSize} ref={tableRef} onKeyDown={onKeyDown}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col" className={dkCss.diagnosekodeCol}>Kode</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
                        <Table.HeaderCell scope="col" className={dkCss.actionCol}></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body className={isLoading ? dkCss.transparent : dkCss.nonTransparent} >
                    <DiagnosekodeRows diagnosekoder={diagnosekoder} onSelectedDiagnose={onSelectedDiagnose} />
                </Table.Body>
            </Table>
        </div>
    )
})
DiagnosekodeTable.displayName = "DiagnosekodeTable"

const emptySearchResult: DiagnosekodeSearchResult<ICD10Diagnosekode> = {
    diagnosekoder: [],
    pageNumber: 0,
    hasMore: false,
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
    const [searchResult, setSearchResult] = useState<DiagnosekodeSearchResult<ICD10Diagnosekode>>(emptySearchResult)
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const diagnosekodeTableRef = useRef<DiagnosekodeTableMethods>(null)

    const trimmedSearchText = searchParams.searchText.trim(); // No point in doing a new search if user just adds/removes a space
    const pageNumber = searchParams.pageNumber;

    useEffect(() => {
        const abortController = new AbortController();
        const fetchDiagnosekoder = async (): Promise<void> => {
            try {
                // We can improve this later, to not debounce on the first run, or when it is the pageNumber that has changed.
                await debounce(100, abortController.signal)
                try {
                    setIsLoading(true)
                    const searchResult = await searchDiagnosekoderFetch(trimmedSearchText, pageNumber, abortController.signal);
                    if (pageNumber > 1) {
                        // The search result is a paging continuation, add it to the existing result
                        setSearchResult(existing =>
                            ({
                                diagnosekoder: [...existing.diagnosekoder, ...searchResult.diagnosekoder],
                                pageNumber: searchResult.pageNumber,
                                hasMore: searchResult.hasMore,
                            })
                        );
                    } else { // Search result is a new first page result
                        setSearchResult(searchResult)
                    }
                } finally {
                    setIsLoading(false)
                }
            } catch (err) {
                if (err instanceof AbortedDebounce) {
                    // Do nothing, we just debounced and started a new search
                } else if (err instanceof DOMException && err.name === "AbortError") {
                    // Do nothing we just aborted a request because of new search input
                } else {
                    throw err;
                }
            }
        };

        fetchDiagnosekoder()
            .then(
                () => {
                    setError(null)
                } , err => {
                    if(err instanceof Error) {
                        console.error(`fetchDiagnosekoder failed`, err)
                        setError(err)
                    } else {
                        console.error(`fetchDiagnosekoder failed`, err)
                        setError(new Error(err))
                    }
                }
            )
        return () => {
            abortController.abort('New search input')
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
            isLoading={isLoading}
        />;

    const showMoreElements = searchResult.hasMore ?
        <div className="flex justify-center py-4">
            <Button size={componentSize} onClick={handleShowMoreClicked} variant="tertiary" icon={<ChevronDownDoubleIcon aria-hidden />}>Vis flere rader</Button>
        </div> :
        null;

    return (
        <>
                <Search
                    size={componentSize}
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
