'use server'

import { getServerEnv } from '@/utils/env';

export const fhirClientId = async (): Promise<string> => {
    return getServerEnv().FHIR_CLIENT_ID;
}

export const isSimulationAllowed = (): boolean => {
    return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" || process.env.SIMULATION_ALLOWED === "true"
}