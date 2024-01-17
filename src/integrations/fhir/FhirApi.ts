import InitData from "@/models/InitData";
import { LegeerklaeringDokumentReferanse } from "@/models/LegeerklaeringDokumentReferanse";
import { DipsDepartmentReference } from "@/models/DipsDepartmentReference";

export interface FhirApi {
    getInitState(): Promise<InitData>;

    createDocument(patientEhrId: string, practitionerRoleId: string, custodianReference: DipsDepartmentReference, description: LegeerklaeringDokumentReferanse, pdf: Blob): Promise<string>;
    getDocumentPdf(documentId: string): Promise<Blob>;
}
