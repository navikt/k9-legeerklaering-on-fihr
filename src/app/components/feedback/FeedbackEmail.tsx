import feedbackEmailAddress from "@/app/components/feedback/feedbackEmailAddress";

export interface FeedbackEmailProps {
    readonly subjectSuggestion?: string
}

// It is recommended to escape spaces in subject with %20 https://css-tricks.com/snippets/html/mailto-links/
const escapeRegex = /\s/g
const escapeSpaces = (str: string) => str.replaceAll(escapeRegex, "%20")

export const defaultSubjectSuggestion = "Tilbakemelding legeerklæring pilot"

const FeedbackEmail = ({subjectSuggestion = defaultSubjectSuggestion}: FeedbackEmailProps) => {
    return <a href={`mailto:${feedbackEmailAddress}?subject=${escapeSpaces(subjectSuggestion)}`}>{feedbackEmailAddress}</a>
}

export default FeedbackEmail
