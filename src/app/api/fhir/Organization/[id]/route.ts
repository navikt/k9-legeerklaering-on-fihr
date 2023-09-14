import { NextRequest, NextResponse } from 'next/server';
import { IOrganization } from '@ahryman40k/ts-fhir-types/lib/R4';
import { headers } from 'next/headers';
import { validateOrThrow } from '@/app/api/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';

export const GET = async (_: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IOrganization>> => {
    console.log("Fetching organization")
    const headersList = headers()

    const fhirbaseurl = process.env.FHIR_BASE_URL;
    const fhirsubscriptionkey = process.env.FHIR_SUBSCRIPTION_KEY;
    const authorization = headersList.get("fhir-authorization-token");

    const response = await fetch(`${fhirbaseurl}/Organization/${params.id}`, {
        headers: {
            "Authorization": authorization ?? "",
            "dips-subscription-key": fhirsubscriptionkey ?? ""
        }
    });

    const data = await response.json() as IOrganization;
    const organization = validateOrThrow(R4.RTTI_Organization.decode(data));
    if (!organization) {
        throw new Error("Unable to decode the organization");
    }
    return NextResponse.json(organization)
}
