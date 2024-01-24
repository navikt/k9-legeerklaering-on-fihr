import LegeerklaeringDokument from "@/models/LegeerklaeringDokument";

export interface SelfApi {
    generatePdf(innsending: LegeerklaeringDokument): Promise<Blob>;
}