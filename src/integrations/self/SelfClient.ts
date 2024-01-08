import { SelfApi } from "@/integrations/self/SelfApi";

export class SelfClient implements SelfApi {
    async generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Blob> {
        const pdfResponse = await fetch(`/api/oppsummering/pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(innsending)
        })
        if(pdfResponse.ok) {
            return await pdfResponse.blob()
        } else {
            throw new Error(`Unexpected status code when fetching pdf (${pdfResponse.status} - ${pdfResponse.statusText}).`, {
                cause: await pdfResponse.text()
            })
        }
    }
}