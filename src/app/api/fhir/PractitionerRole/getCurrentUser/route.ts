import { NextResponse } from 'next/server';
import { fhirclient } from 'fhirclient/lib/types';
import { headers } from 'next/headers';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { IPractitionerRole } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/app/api/fhir/fhirValidator';
import Bundle = fhirclient.FHIR.Bundle;

export const GET = async (): Promise<NextResponse<IPractitionerRole>> => {
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
    if (!bundle.entry || bundle.entry.length === 0) {
        throw new Error("No entries found in the bundle.");
    }

    const practitionerRole = validateOrThrow(R4.RTTI_PractitionerRole.decode(bundle.entry[0].resource as IPractitionerRole));
    if (!practitionerRole) {
        throw new Error("Unable to decode the current user.");
    }

    return NextResponse.json(practitionerRole as IPractitionerRole)
}
