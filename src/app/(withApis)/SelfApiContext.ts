import { createContext } from "react";
import { SelfApi } from "@/integrations/self/SelfApi";
import LegeerklaeringDokument from "@/models/LegeerklaeringDokument";

const uninitialized: SelfApi = {
    generatePdf(innsending: LegeerklaeringDokument): Promise<Blob> {
        throw new Error("SelfApiContext not set")
    }
}

const SelfApiContext = createContext<SelfApi>(uninitialized)

export default SelfApiContext;