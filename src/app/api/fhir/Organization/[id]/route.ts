import { NextRequest, NextResponse } from 'next/server';
import { IOrganization } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { fhirConfiguration } from '@/integrations/fhir/FhirConfiguration';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IOrganization>> => {
    console.log("Fetching organization")
    const {fhirbaseurl, fhirsubscriptionkey, authorization} = fhirConfiguration();

    const response = await fetch(`${fhirbaseurl}/Organization/${params.id}`, {
        headers: {
            "Authorization": authorization,
            "dips-subscription-key": fhirsubscriptionkey
        }
    });

    const organization = validateOrThrow(R4.RTTI_Organization.decode(await response.json()));
    return NextResponse.json(organization)
}
