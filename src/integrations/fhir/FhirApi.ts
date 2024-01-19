import InitData from "@/models/InitData";
import { LegeerklaeringDokumentReferanse } from "@/models/LegeerklaeringDokumentReferanse";

export interface FhirApi {
    getInitState(): Promise<InitData>;

    createDocument(patientEhrId: string, practitionerRoleId: string, hospitalEhrId: string, description: LegeerklaeringDokumentReferanse, pdf: Blob): Promise<string>;
    getDocumentPdf(documentId: string): Promise<Blob>;
}
