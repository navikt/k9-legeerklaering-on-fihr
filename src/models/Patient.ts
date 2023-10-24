import RelatedPerson from "@/models/RelatedPerson";

export default interface Patient {
    readonly name: string;
    readonly identifier: string;
    readonly birthDate?: Date;
    readonly caretakers: RelatedPerson[];
}