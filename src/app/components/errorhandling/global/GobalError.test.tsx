import { render } from "@testing-library/react";
import GlobalError from "@/app/components/errorhandling/global/GlobalError";
import userEvent from "@testing-library/user-event";

describe("GlobalError", () => {
    test("work as expected with basic error input", async () => {
        const error = new Error("Test error")
        const reset = jest.fn()
        const rendered = render(<GlobalError error={error} reset={reset} />)
        const errorB = rendered.getByText("Feilmelding:")
        const errorMessage = errorB.parentElement
        expect(errorMessage?.textContent).toContain(error.message)
        const digestB = rendered.queryByText("Referanse:")
        expect(digestB).toBeNull()
        const retryBtn = rendered.getByText("Prøv på nytt", {selector: "span"})
        await userEvent.click(retryBtn)
        expect(reset).toHaveBeenCalled()
    })

    test("shows digest when that is present", async () => {
        const error: Error & {digest?: string} = new Error("Test with digest")
        error.digest = "digest1"
        const reset = jest.fn()
        const rendered = render(<GlobalError error={error} reset={reset} />)
        const digestB = rendered.getByText("Referanse:")
        const digestMessage = digestB.parentElement
        expect(digestMessage?.textContent).toContain(error.digest)
    })
})