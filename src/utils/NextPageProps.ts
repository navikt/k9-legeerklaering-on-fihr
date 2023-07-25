export default interface NextPageProps {
    readonly params: {slug: string};
    readonly searchParams: { [key: string]: string | string[] | undefined };
}