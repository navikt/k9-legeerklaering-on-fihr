import { PSBLegeerklæringInnsending } from "@/integrations/helseopplysningerserver/types/HelseopplysningerTypes";

export interface HelseopplysningerApi {
    generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Blob>;
}