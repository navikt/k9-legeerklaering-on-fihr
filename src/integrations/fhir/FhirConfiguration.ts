import { logger } from '@/utils/logger';

export class FhirConfiguration {
    private _fhirbaseurl: string;
    private _fhirsubscriptionkey: string;

    get fhirbaseurl(): string {
        return this._fhirbaseurl;
    }

    get fhirsubscriptionkey(): string {
        return this._fhirsubscriptionkey;
    }

    constructor() {
        const {FHIR_BASE_URL, FHIR_SUBSCRIPTION_KEY} = process.env;
        if (!FHIR_BASE_URL) {
            const error = new Error("FHIR_BASE_URL is not defined.");
            logger.error(error);
            throw error;
        }
        this._fhirbaseurl = FHIR_BASE_URL;

        if (!FHIR_SUBSCRIPTION_KEY) {
            const error1 = new Error("FHIR_SUBSCRIPTION_KEY is not defined.");
            logger.error(error1);
            throw error1;
        }
        this._fhirsubscriptionkey = FHIR_SUBSCRIPTION_KEY;
    }
}
