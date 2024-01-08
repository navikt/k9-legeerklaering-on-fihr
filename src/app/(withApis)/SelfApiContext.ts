import { createContext } from "react";
import { SelfApi } from "@/integrations/self/SelfApi";

const uninitialized: SelfApi = {
    generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Blob> {
        throw new Error("SelfApiContext not set")
    }
}

const SelfApiContext = createContext<SelfApi>(uninitialized)

export default SelfApiContext;