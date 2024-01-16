import { PSBLegeerklæringInnsending } from "@/integrations/helseopplysningerserver/types/HelseopplysningerTypes";

export interface SelfApi {
    generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Blob>;
}