import { NextRequest, NextResponse } from 'next/server';
import { IPractitioner } from '@ahryman40k/ts-fhir-types/lib/R4';
import { headers } from 'next/headers';
import { validateOrThrow } from '@/app/api/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';


export const GET = async (_: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IPractitioner>> => {
    console.log("Fetching practitioner")
    const headersList = headers()

    const fhirbaseurl = process.env.FHIR_BASE_URL;
    const fhirsubscriptionkey = process.env.FHIR_SUBSCRIPTION_KEY;
    const authorization = headersList.get("fhir-authorization-token");

    const response = await fetch(`${fhirbaseurl}/Practitioner/${params.id}`, {
        headers: {
            "Authorization": authorization ?? "",
            "dips-subscription-key": fhirsubscriptionkey ?? ""
        }
    });

    const practitioner = validateOrThrow(R4.RTTI_Practitioner.decode(await response.json()));
    return NextResponse.json(practitioner)
}
