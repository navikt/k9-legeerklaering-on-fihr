export default interface NextErrorProps {
    readonly error: Error & { digest?: string }
    readonly reset: () => void
}