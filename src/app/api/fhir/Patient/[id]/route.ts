import { NextRequest, NextResponse } from 'next/server';
import { IPatient } from '@ahryman40k/ts-fhir-types/lib/R4';
import { headers } from 'next/headers';
import { validateOrThrow } from '@/app/api/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IPatient>> => {
    console.log("Fetching patient")
    const headersList = headers()

    const fhirbaseurl = process.env.FHIR_BASE_URL;
    const fhirsubscriptionkey = process.env.FHIR_SUBSCRIPTION_KEY;
    const authorization = headersList.get("fhir-authorization-token");

    const response = await fetch(`${fhirbaseurl}/Patient/${params.id}`, {
        headers: {
            "Authorization": authorization ?? "",
            "dips-subscription-key": fhirsubscriptionkey ?? ""
        }
    });

    const patient = validateOrThrow(R4.RTTI_Patient.decode(await response.json()));
    return NextResponse.json(patient)
}
