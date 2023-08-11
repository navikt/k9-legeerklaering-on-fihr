import {render, waitFor, screen} from "@testing-library/react";
import DiagnosekodeSearch from "@/app/components/diagnosekoder/DiagnosekodeSearch";
import {type Diagnosekode} from "@navikt/diagnosekoder";
import {searchDiagnosekoderFetch} from "@/app/api/diagnosekoder/client";
import {fakeDiagnosekoder} from "@/tests/DiagnosekodeSearcher.test";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

jest.mock("@/app/api/diagnosekoder/client")

const mockedSearchDiagnosekoderFetch = jest.mocked(searchDiagnosekoderFetch);

describe("DiagnosekodeSearch works", () => {
    test("initial empty search returns pages of results", async () => {
        const firstPageDiagnosekoder = fakeDiagnosekoder.slice(0, 3);
        const secondPageDiagnosekoder = fakeDiagnosekoder.slice(3, 100);
        // This mocks a first result with no search input
        mockedSearchDiagnosekoderFetch.mockResolvedValue({
            diagnosekoder: firstPageDiagnosekoder,
            hasMore: true,
            pageNumber: 1,
        });
        const rendered = render(<DiagnosekodeSearch />)

        // We must wait until the (mocked) fetch has returned to see the table rendered with the result
        await waitFor(() => {
            expect(mockedSearchDiagnosekoderFetch).toHaveReturned()
        })

        const table = await rendered.findByRole("table")
        expect(table).toMatchSnapshot()

        for(const dk of firstPageDiagnosekoder) {
            expect(await rendered.findByText(dk.code)).toBeInTheDocument()
            expect(await rendered.findByText(dk.text)).toBeInTheDocument()
        }
        for(const dk of secondPageDiagnosekoder) {
            expect(rendered.queryByText(dk.code)).toBeNull()
            expect(rendered.queryByText(dk.code)).not.toBeInTheDocument()
            expect(rendered.queryByText(dk.text)).not.toBeInTheDocument()
        }

        // Setup mock to return next page of results
        mockedSearchDiagnosekoderFetch.mockReset().mockResolvedValue({
            diagnosekoder: secondPageDiagnosekoder,
            hasMore: false,
            pageNumber: 2,
        })

        const getMoreBtn = screen.getByText(/Vis flere rader/i);
        await userEvent.click(getMoreBtn);

        // Wait for fetch of next page to return
        await waitFor(() => {
            expect(mockedSearchDiagnosekoderFetch).toHaveReturned()
        })

        // All diagnosekode rows should be in the document now
        for(const dk of fakeDiagnosekoder) {
            expect(rendered.getByText(dk.code)).toBeInTheDocument()
            expect(rendered.getByText(dk.text)).toBeInTheDocument()
        }

        // Show more rows should not display anymore
        expect(getMoreBtn).not.toBeInTheDocument()
    })

    test("searching for a diagnose should work", async () => {
        mockedSearchDiagnosekoderFetch.mockReset().mockResolvedValue({
            diagnosekoder: fakeDiagnosekoder.slice(0,1),
            hasMore: false,
            pageNumber: 1,
        })
        const rendered = render(<DiagnosekodeSearch />)
        const searchInput = rendered.getByRole("searchbox");
        expect(searchInput).toBeInTheDocument()
        const inputCode = "a001"
        await userEvent.type(searchInput, inputCode);
        await waitFor(() => expect(mockedSearchDiagnosekoderFetch).toHaveReturned())
        expect(mockedSearchDiagnosekoderFetch).toHaveBeenCalledWith(inputCode, 1, (new AbortController()).signal)
        expect(rendered.getByText(fakeDiagnosekoder[0].code)).toBeInTheDocument()
        expect(rendered.getByText(fakeDiagnosekoder[0].text)).toBeInTheDocument()
    })

    test("clicking a diagnose row should select it", async () => {
        const onSelected = jest.fn((dk: Diagnosekode) => void 0);
        const rendered = render(<DiagnosekodeSearch onSelectedDiagnose={onSelected} />)
        mockedSearchDiagnosekoderFetch.mockReset().mockResolvedValue({
            diagnosekoder: fakeDiagnosekoder.slice(0,1),
            hasMore: false,
            pageNumber: 1,
        })
        await waitFor(() => expect(mockedSearchDiagnosekoderFetch).toHaveReturned())
        const diagnosekode1 = fakeDiagnosekoder[0];
        await userEvent.click(rendered.getByText(diagnosekode1.code))
        expect(onSelected).toHaveBeenCalledWith(diagnosekode1)

        onSelected.mockReset();
        const selectBtn = rendered.getByLabelText("Velg", {selector: "button"});
        await userEvent.click(selectBtn)
        expect(onSelected).toHaveBeenCalledWith(diagnosekode1)
    })
})