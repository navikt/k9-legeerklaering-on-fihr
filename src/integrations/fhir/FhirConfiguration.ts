
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
            throw new Error("FHIR_BASE_URL is not defined.");
        }
        this._fhirbaseurl = FHIR_BASE_URL;

        if (!FHIR_SUBSCRIPTION_KEY) {
            throw new Error("FHIR_SUBSCRIPTION_KEY is not defined.");
        }
        this._fhirsubscriptionkey = FHIR_SUBSCRIPTION_KEY;
    }
}
