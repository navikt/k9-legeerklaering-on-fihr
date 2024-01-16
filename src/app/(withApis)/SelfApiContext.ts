import { createContext } from "react";
import { SelfApi } from "@/integrations/self/SelfApi";
import { PSBLegeerklæringInnsending } from "@/integrations/helseopplysningerserver/types/HelseopplysningerTypes";

const uninitialized: SelfApi = {
    generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Blob> {
        throw new Error("SelfApiContext not set")
    }
}

const SelfApiContext = createContext<SelfApi>(uninitialized)

export default SelfApiContext;