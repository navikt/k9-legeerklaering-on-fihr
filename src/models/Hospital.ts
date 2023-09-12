import Address from "@/models/Address";

export default interface Hospital {
    readonly name?: string;
    readonly phoneNumber?: string;
    readonly address?: Address;
}
