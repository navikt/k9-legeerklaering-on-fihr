import { NextResponse } from 'next/server';
import { fhirclient } from 'fhirclient/lib/types';
import { headers } from 'next/headers';
import Bundle = fhirclient.FHIR.Bundle;

export const GET = async (): Promise<NextResponse> => {
    console.log("Fetching current user")
    const headersList = headers()

    const fhirbaseurl = process.env.FHIR_BASE_URL;
    const fhirsubscriptionkey = process.env.FHIR_SUBSCRIPTION_KEY;
    const authorization = headersList.get("fhir-authorization-token");

    const response = await fetch(`${fhirbaseurl}/PractitionerRole/$getCurrentUser`, {
        headers: {
            "Authorization": authorization ?? "",
            "dips-subscription-key": fhirsubscriptionkey ?? ""
        }
    });

    const bundle: Bundle = await response.json();
    console.log("bundle", bundle)
    return NextResponse.json(bundle)
}
