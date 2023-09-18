import { NextRequest, NextResponse } from 'next/server';
import { IPatient } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { headers } from 'next/headers';
import { FhirConfiguration } from '@/integrations/fhir/FhirConfiguration';
import { FHIR_AUTHORIZATION_TOKEN } from '@/middleware';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IPatient>> => {
    const authorization = headers().get(FHIR_AUTHORIZATION_TOKEN);
    const {fhirbaseurl, fhirsubscriptionkey} = new FhirConfiguration();

    const response = await fetch(`${fhirbaseurl}/Patient/${params.id}`, {
        headers: {
            "Authorization": authorization!!,
            "dips-subscription-key": fhirsubscriptionkey
        }
    });

    const patient = validateOrThrow(R4.RTTI_Patient.decode(await response.json()));
    return NextResponse.json(patient)
}
