import Address from "@/models/Address";

export default interface Hospital {
    readonly navn?: string;
    readonly tlf?: string;
    readonly adresse?: Address;
}
