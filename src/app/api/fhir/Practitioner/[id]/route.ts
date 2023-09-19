import { NextRequest, NextResponse } from 'next/server';
import { IPractitioner } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { FhirConfiguration } from '@/integrations/fhir/FhirConfiguration';
import { headers } from 'next/headers';
import { FHIR_AUTHORIZATION_TOKEN } from '@/middleware';
import { logRequest, logResponse } from '@/utils/loggerUtils';


export const GET = async (request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IPractitioner>> => {
    logRequest(request)
    const authorization = headers().get(FHIR_AUTHORIZATION_TOKEN);
    const {fhirbaseurl, fhirsubscriptionkey} = new FhirConfiguration();

    const response = await fetch(`${fhirbaseurl}/Practitioner/${params.id}`, {
        headers: {
            "Authorization": authorization!!,
            "dips-subscription-key": fhirsubscriptionkey
        }
    });

    const practitioner = validateOrThrow(R4.RTTI_Practitioner.decode(await response.json()));
    const nextResponse = NextResponse.json(practitioner);
    logResponse(request.nextUrl, nextResponse)
    return nextResponse
}
