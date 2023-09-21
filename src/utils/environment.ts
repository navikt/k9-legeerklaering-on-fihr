'use server'

import { getServerEnv } from '@/utils/env';

export const fhirClientId = async (): Promise<string> => {
    return getServerEnv().FHIR_CLIENT_ID;
}
