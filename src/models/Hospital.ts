import Address from "@/models/Address";

export default interface Hospital {
    readonly ehrId?: string;
    readonly organizationNumber?: string;
    readonly name: string;
    readonly phoneNumber?: string;
    readonly address?: Address;
}
