'use server'

import { getServerEnv } from '@/utils/env';

export const fhirClientId = async (): Promise<string> => {
    return getServerEnv().FHIR_CLIENT_ID;
}

export const isSimulationAllowed = (): boolean => {
    return getServerEnv().SIMULATION_ALLOWED
}

export const isSyntheticIdentifierAllowed = (): boolean => {
    return getServerEnv().SYNTHETIC_IDENTIFIER_ALLOWED
}
