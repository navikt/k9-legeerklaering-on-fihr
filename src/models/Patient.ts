import Navn from "@/models/Navn";

export default interface Patient {
    readonly navn: Navn;
    readonly fnr: string;
    readonly fødselsdato?: Date;
}