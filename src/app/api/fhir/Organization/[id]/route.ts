import { NextRequest, NextResponse } from 'next/server';
import { IOrganization } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { headers } from 'next/headers';
import { FHIR_AUTHORIZATION_TOKEN } from '@/utils/constants';
import { logRequest, logResponse } from '@/utils/loggerUtils';
import { getServerEnv } from '@/utils/env';

export const GET = async (request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IOrganization>> => {
    logRequest(request)
    const authorization = headers().get(FHIR_AUTHORIZATION_TOKEN);
    const {FHIR_BASE_URL, FHIR_SUBSCRIPTION_KEY} = getServerEnv();

    const response = await fetch(`${FHIR_BASE_URL}/Organization/${params.id}`, {
        headers: {
            "Authorization": authorization!!,
            "dips-subscription-key": FHIR_SUBSCRIPTION_KEY
        }
    });

    const organization = validateOrThrow(R4.RTTI_Organization.decode(await response.json()));
    const nextResponse = NextResponse.json(organization);
    logResponse(request.nextUrl, nextResponse)
    return nextResponse
}
