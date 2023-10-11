import Patient from "@/models/Patient";
import Practitioner from "@/models/Practitioner";
import Hospital from "@/models/Hospital";

/**
 * This holds the initial app state loaded from fhir api
 */
export default interface InitData {
    readonly patient: Patient;
    readonly practitioner: Practitioner;
    readonly hospital: Hospital | undefined;
}