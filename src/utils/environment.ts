'use server'

import { FhirConfiguration } from '@/integrations/fhir/FhirConfiguration';

export const fhirClientId = async (): Promise<string> => {
    return new FhirConfiguration().fhirClientId
}
