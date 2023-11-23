import InitData from "@/models/InitData";
import { IDocumentReference } from '@ahryman40k/ts-fhir-types/lib/R4';

export interface FhirApi {
    getInitState(): Promise<InitData>;
    createDocument(patientEhrId: string, providerEhrId: string, hospitalEhrId: string, pdf: Blob): Promise<IDocumentReference>;
}
