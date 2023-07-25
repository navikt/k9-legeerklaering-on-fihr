import Address from "@/models/Address";

export default interface Hospital {
    readonly name: string | undefined;
    readonly phoneNumber: string | undefined;
    readonly address: Address | undefined;
}