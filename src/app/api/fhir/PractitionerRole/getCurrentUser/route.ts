import { NextRequest, NextResponse } from 'next/server';
import { fhirclient } from 'fhirclient/lib/types';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { IPractitionerRole } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { headers } from 'next/headers';
import { FhirConfiguration } from '@/integrations/fhir/FhirConfiguration';
import { FHIR_AUTHORIZATION_TOKEN } from '@/middleware';
import { logRequest, logResponse } from '@/utils/loggerUtils';
import Bundle = fhirclient.FHIR.Bundle;

export const GET = async (request: NextRequest): Promise<NextResponse<IPractitionerRole | Error>> => {
    logRequest(request)
    const authorization = headers().get(FHIR_AUTHORIZATION_TOKEN)!!;
    const {fhirBaseUrl, fhirSubscriptionKey} = new FhirConfiguration();

    const response = await fetch(`${fhirBaseUrl}/PractitionerRole/$getCurrentUser`, {
        headers: {
            "Authorization": authorization,
            "dips-subscription-key": fhirSubscriptionKey
        }
    });

    const bundle: Bundle = await response.json();
    if (!bundle.entry || bundle.entry.length === 0) {
        throw new Error("No entries found in the bundle.");
    }

    const practitionerRole = validateOrThrow(R4.RTTI_PractitionerRole.decode(bundle.entry[0].resource));
    const nextResponse = NextResponse.json(practitionerRole);
    logResponse(request.nextUrl, nextResponse)
    return nextResponse
}
