import { NextRequest, NextResponse } from 'next/server';
import { IOrganization } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { FhirConfiguration } from '@/integrations/fhir/FhirConfiguration';
import { headers } from 'next/headers';
import { FHIR_AUTHORIZATION_TOKEN } from '@/middleware';
import { logRequest, logResponse } from '@/utils/loggerUtils';

export const GET = async (request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IOrganization>> => {
    logRequest(request)
    const authorization = headers().get(FHIR_AUTHORIZATION_TOKEN);
    const {fhirBaseUrl, fhirSubscriptionKey} = new FhirConfiguration();

    const response = await fetch(`${fhirBaseUrl}/Organization/${params.id}`, {
        headers: {
            "Authorization": authorization!!,
            "dips-subscription-key": fhirSubscriptionKey
        }
    });

    const organization = validateOrThrow(R4.RTTI_Organization.decode(await response.json()));
    const nextResponse = NextResponse.json(organization);
    logResponse(request.nextUrl, nextResponse)
    return nextResponse
}
