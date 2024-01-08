export interface HelseopplysningerApi {
    generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Blob>;
}