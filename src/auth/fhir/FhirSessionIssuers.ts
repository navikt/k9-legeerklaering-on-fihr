import { type Issuer } from "@/auth/fhir/Issuer";

export class FhirSessionIssuers {
    static readonly OPENDIPS_TEST: Issuer = 'https://api.dips.no/dips.oauth' // opendips sandbox for dev/testing

    // XXX Should probably change this to be a server configuration value later.
    static readonly all: Issuer[] = [
        FhirSessionIssuers.OPENDIPS_TEST,
    ]

}