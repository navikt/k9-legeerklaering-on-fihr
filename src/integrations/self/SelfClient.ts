import { SelfApi } from "@/integrations/self/SelfApi";
import { PSBLegeerklæringInnsending } from "@/integrations/helseopplysningerserver/types/HelseopplysningerTypes";

export type FhirAuthTokenResolver = () => Promise<string | undefined | null>

export class SelfClient implements SelfApi {

    constructor(private readonly fhirAuthTokenResolver: FhirAuthTokenResolver) {
    }

    /**
     * Gets the current fhir api jwt auth token so that it can be sent to our server when our backend needs to
     * authenticate that a request comes from a valid smart on fhir session.
     * @private
     */
    private async fhirAuthToken(): Promise<string> {
        const authToken = await this.fhirAuthTokenResolver()
        if(authToken === undefined || authToken === null) {
            throw new Error(`This request cannot be done without valid fhir auth token`)
        }
        return authToken
    }

    async generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Blob> {
        const authToken = await this.fhirAuthToken()
        const pdfResponse = await fetch(`/api/oppsummering/pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authToken,
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