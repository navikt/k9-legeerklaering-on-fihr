import Address from "@/models/Address";

export default interface Hospital {
    readonly name: string;
    readonly phoneNumber: string | undefined;
    readonly address: Address | undefined;
}