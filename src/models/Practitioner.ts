import { HprNumber } from "@/models/HprNumber";

export default interface Practitioner {
    readonly ehrId: string;
    readonly hprNumber: HprNumber | undefined ;
    readonly name: string;
    readonly activeSystemUser: boolean;

}

/**
 * A copy of Practitioner with all properties except activeSystemUser being possibly undefined.
 * This is used while checking/transforming/merging the potentially undefined return values from Pracitioner and
 * PractitionerRole
 */
export type PartialPractitioner = Partial<Practitioner> & Pick<Practitioner, "activeSystemUser">