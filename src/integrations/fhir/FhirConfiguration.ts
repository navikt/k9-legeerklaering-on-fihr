import { logger } from '@navikt/next-logger';

export class FhirConfiguration {
    private _fhirBaseUrl: string;
    private _fhirClientId: string;
    private _fhirSubscriptionKey: string;

    get fhirBaseUrl(): string {
        return this._fhirBaseUrl;
    }

    get fhirClientId(): string {
        return this._fhirClientId;
    }

    get fhirSubscriptionKey(): string {
        return this._fhirSubscriptionKey;
    }

    constructor() {
        const {FHIR_BASE_URL, FHIR_CLIENT_ID, FHIR_SUBSCRIPTION_KEY} = process.env;
        if (!FHIR_BASE_URL) {
            const fhirbaseurlMissing = new Error("FHIR_BASE_URL is not defined.");
            logger.error(fhirbaseurlMissing);
            throw fhirbaseurlMissing;
        }
        this._fhirBaseUrl = FHIR_BASE_URL;
        logger.info(`FHIR_BASE_URL --> ${this._fhirBaseUrl}`);

        if (!FHIR_CLIENT_ID) {
            const fhirClientIdMissing = new Error("FHIR_CLIENT_ID is not defined.");
            logger.error(fhirClientIdMissing);
            throw fhirClientIdMissing;
        }
        this._fhirClientId = FHIR_CLIENT_ID;
        logger.info(`FHIR_CLIENT_ID --> ${this._fhirClientId}`);

        if (!FHIR_SUBSCRIPTION_KEY) {
            const fhirsubscriptionkeyMissing = new Error("FHIR_SUBSCRIPTION_KEY is not defined.");
            logger.error(fhirsubscriptionkeyMissing);
            throw fhirsubscriptionkeyMissing;
        }
        this._fhirSubscriptionKey = FHIR_SUBSCRIPTION_KEY;
        logger.info("FHIR_SUBSCRIPTION_KEY --> ***************");
    }
}
