import { NextRequest, NextResponse } from 'next/server';
import { IOrganization } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { FhirConfiguration } from '@/integrations/fhir/FhirConfiguration';
import { headers } from 'next/headers';
import { FHIR_AUTHORIZATION_TOKEN } from '@/middleware';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IOrganization>> => {
    console.log("Fetching organization")

    const authorization = headers().get(FHIR_AUTHORIZATION_TOKEN);
    const {fhirbaseurl, fhirsubscriptionkey} = new FhirConfiguration();

    const response = await fetch(`${fhirbaseurl}/Organization/${params.id}`, {
        headers: {
            "Authorization": authorization!!,
            "dips-subscription-key": fhirsubscriptionkey
        }
    });

    const organization = validateOrThrow(R4.RTTI_Organization.decode(await response.json()));
    return NextResponse.json(organization)
}
