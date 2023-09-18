import { FhirConfiguration } from '@/integrations/fhir/FhirConfiguration';

/**
 * This function is called when the Next.js server instance is bootstrapped.
 */
export const register = async () => {
    console.log("Validating FhirConfiguration");
    new FhirConfiguration() // This will throw if the configuration is invalid
};
