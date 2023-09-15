import { NextRequest, NextResponse } from 'next/server';
import { IPractitioner } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { fhirConfiguration } from '@/integrations/fhir/FhirConfiguration';


export const GET = async (_: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IPractitioner>> => {
    console.log("Fetching practitioner")
    const {fhirbaseurl, fhirsubscriptionkey, authorization} = fhirConfiguration();

    const response = await fetch(`${fhirbaseurl}/Practitioner/${params.id}`, {
        headers: {
            "Authorization": authorization,
            "dips-subscription-key": fhirsubscriptionkey
        }
    });

    const practitioner = validateOrThrow(R4.RTTI_Practitioner.decode(await response.json()));
    return NextResponse.json(practitioner)
}
