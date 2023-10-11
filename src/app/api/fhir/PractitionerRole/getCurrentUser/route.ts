import { NextRequest, NextResponse } from 'next/server';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { IPractitionerRole } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { headers } from 'next/headers';
import { logRequest, logResponse } from '@/utils/loggerUtils';
import { getServerEnv } from '@/utils/env';
import { FHIR_AUTHORIZATION_TOKEN } from "@/utils/constants";

const isPractitionerRoleOrThrow = (resource?: R4.IResourceList): R4.IPractitionerRole => {
    if(R4.RTTI_PractitionerRole.is(resource)) {
        return resource;
    }
    throw new Error(`resource ${resource?.resourceType} is not a ${R4.RTTI_PractitionerRole.name}`);
}

export const GET = async (request: NextRequest): Promise<NextResponse<IPractitionerRole | Error>> => {
    logRequest(request)
    const authorization = headers().get(FHIR_AUTHORIZATION_TOKEN)!!;
    const {FHIR_BASE_URL, FHIR_SUBSCRIPTION_KEY} = getServerEnv();

    const response = await fetch(`${FHIR_BASE_URL}/PractitionerRole/$getCurrentUser`, {
        headers: {
            "Authorization": authorization,
            "dips-subscription-key": FHIR_SUBSCRIPTION_KEY
        }
    });

    if(response.ok) {
        const bundle = validateOrThrow(R4.RTTI_Bundle.decode(await response.json()));
        if (!bundle.entry || bundle.entry.length === 0) {
            throw new Error("No entries found in the bundle.");
        }

        const practitionerRole: R4.IPractitionerRole = isPractitionerRoleOrThrow(bundle.entry[0].resource)
        const nextResponse = NextResponse.json(practitionerRole);
        logResponse(request.nextUrl, nextResponse)
        return nextResponse
    } else {
        const text = await response.text()
        throw new Error(`invalid response to fhir fetch: ${response.status} - ${response.statusText} == ${text}`)
    }
}
