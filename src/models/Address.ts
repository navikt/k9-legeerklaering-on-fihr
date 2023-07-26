export default interface Address {
    readonly line1?: string;
    readonly line2?: string;
    readonly postalCode: string | undefined;
    readonly city: string | undefined;
}