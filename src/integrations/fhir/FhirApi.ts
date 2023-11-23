import InitData from "@/models/InitData";

export interface FhirApi {
    getInitState(): Promise<InitData>;
    createDocument(patientEhrId: string, providerEhrId: string, hospitalEhrId: string, pdf: Blob): Promise<any>;
}
