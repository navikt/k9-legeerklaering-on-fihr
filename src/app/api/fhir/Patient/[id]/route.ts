import { NextRequest, NextResponse } from 'next/server';
import { IPatient } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { headers } from 'next/headers';
import { FhirConfiguration } from '@/integrations/fhir/FhirConfiguration';
import { FHIR_AUTHORIZATION_TOKEN } from '@/middleware';
import { logRequest, logResponse } from '@/utils/loggerUtils';

export const GET = async (request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IPatient>> => {
    logRequest(request)
    const authorization = headers().get(FHIR_AUTHORIZATION_TOKEN);
    const {fhirBaseUrl, fhirSubscriptionKey} = new FhirConfiguration();

    const response = await fetch(`${fhirBaseUrl}/Patient/${params.id}`, {
        headers: {
            "Authorization": authorization!!,
            "dips-subscription-key": fhirSubscriptionKey
        }
    });

    const patient = validateOrThrow(R4.RTTI_Patient.decode(await response.json()));
    const nextResponse = NextResponse.json(patient);
    logResponse(request.nextUrl, nextResponse)
    return nextResponse
}
