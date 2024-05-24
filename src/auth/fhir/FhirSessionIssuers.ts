import { type Issuer } from "@/auth/fhir/Issuer";

export class FhirSessionIssuers {
    static readonly OPENDIPS_TEST: Issuer = 'https://api.dips.no/dips.oauth' // opendips sandbox dev/test
    static readonly OPENDIPS_HV_TEST: Issuer = 'https://d-130.test.dips.ihelse.net/dips.oauth' // dips helse vest dev/test

    // XXX Should probably change this to be a server configuration value later.
    static readonly all: Issuer[] = [
        FhirSessionIssuers.OPENDIPS_TEST,
        FhirSessionIssuers.OPENDIPS_HV_TEST,
    ]

}
