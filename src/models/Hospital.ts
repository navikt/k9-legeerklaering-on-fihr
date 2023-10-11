import Address from "@/models/Address";

export default interface Hospital {
    readonly epjId?: string;
    readonly organizationNumber?: string;
    readonly name: string;
    readonly phoneNumber?: string;
    readonly address?: Address;
}
