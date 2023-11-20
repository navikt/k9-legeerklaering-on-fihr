import { logger } from '@navikt/next-logger';
import { getServerEnv } from '@/utils/env';
import AzureClientConfiguration from '@/auth/azure/AzureClientConfiguration';

export default class HelseopplysningerService {
    private baseUrl: string;

    constructor() {
        const {HELSEOPPLYSNINGER_SERVER_BASE_URL} = getServerEnv();
        this.baseUrl = HELSEOPPLYSNINGER_SERVER_BASE_URL;
    }

    public async generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Response> {
        logger.info("Genererer PDF...");
        try {
            const tokenSet = await AzureClientConfiguration.getServerHelseToken();

            const pdfResponse = await fetch(`${this.baseUrl}/pdf/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenSet.access_token}`
                },
                body: JSON.stringify(innsending)
            })
            if (pdfResponse.ok) return pdfResponse;
            else throw new Error(`Unexpected status code when fetching pdf (${pdfResponse.status} - ${pdfResponse.statusText}).`, {
                cause: await pdfResponse.text()
            })
        } catch (error) {
            logger.error(error, "Error generating PDF");
            throw new Error("Error generating PDF");
        }
    }
}
