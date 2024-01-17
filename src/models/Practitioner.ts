import { HprNumber } from "@/models/HprNumber";
import { DipsDepartmentReference } from "@/models/DipsDepartmentReference";

export default interface Practitioner {
    readonly ehrId: string;
    readonly hprNumber: HprNumber | undefined ;
    readonly practitionerRoleId: string | undefined;
    readonly name: string;
    readonly activeSystemUser: boolean;
    // If the users practitionerRole is connected to a department, its reference is set here.
    // This is then used as a default value for custodian on created documents.
    readonly departmentReference: DipsDepartmentReference | undefined;
}

/**
 * A copy of Practitioner with all properties except activeSystemUser being possibly undefined.
 * This is used while checking/transforming/merging the potentially undefined return values from Pracitioner and
 * PractitionerRole
 */
export type PartialPractitioner = Partial<Practitioner> & Pick<Practitioner, "activeSystemUser">
