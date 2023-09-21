import { NextRequest, NextResponse } from 'next/server';
import { fhirclient } from 'fhirclient/lib/types';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { IPractitionerRole } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { headers } from 'next/headers';
import { FHIR_AUTHORIZATION_TOKEN } from '@/middleware';
import { logRequest, logResponse } from '@/utils/loggerUtils';
import { getServerEnv } from '@/utils/env';
import Bundle = fhirclient.FHIR.Bundle;

export const GET = async (request: NextRequest): Promise<NextResponse<IPractitionerRole | Error>> => {
    logRequest(request)
    const authorization = headers().get(FHIR_AUTHORIZATION_TOKEN)!!;
    const {FHIR_BASE_URL, FHIR_SUBSCRIPTION_KEY} = getServerEnv();

    const response = await fetch(`${FHIR_BASE_URL}/PractitionerRole/$getCurrentUser`, {
        headers: {
            "Authorization": authorization,
            "dips-subscription-key": FHIR_SUBSCRIPTION_KEY
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
