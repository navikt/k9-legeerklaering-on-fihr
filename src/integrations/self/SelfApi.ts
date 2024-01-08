export interface SelfApi {
    generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Blob>;
}