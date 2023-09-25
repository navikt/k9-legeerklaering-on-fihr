import Navn from "@/models/Navn";

export default interface Doctor {
    readonly hpr: string;
    readonly navn: Navn;
}