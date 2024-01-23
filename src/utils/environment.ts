'use server'

import { getServerEnv } from '@/utils/env';

export const isSimulationAllowed = (): boolean => {
    return getServerEnv().SIMULATION_ALLOWED
}

export const isSyntheticIdentifierAllowed = (): boolean => {
    return getServerEnv().SYNTHETIC_IDENTIFIER_ALLOWED
}
