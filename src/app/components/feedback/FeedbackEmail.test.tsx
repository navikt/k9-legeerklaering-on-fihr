import { render } from "@testing-library/react";
import FeedbackEmail, { defaultSubjectSuggestion } from "@/app/components/feedback/FeedbackEmail";
import feedbackEmailAddress from "@/app/components/feedback/feedbackEmailAddress";
import { HTMLAnchorElement } from "happy-dom";

describe("FeedbackEmail should render", () => {
    test("as expected with simple subject input", async () => {
        const subject = "test subject"
        const rendered = render(<FeedbackEmail subjectSuggestion={subject} />)
        const elem = await rendered.findByText(feedbackEmailAddress)
        expect(elem.tagName).toEqual("A")
        const link = elem as unknown as HTMLAnchorElement
        expect(link.href).toEqual(`mailto:${feedbackEmailAddress}?subject=${subject.replaceAll(" ", "%20")}`)
    })
})