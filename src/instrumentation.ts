import { FhirConfiguration } from '@/integrations/fhir/FhirConfiguration';
import { logger } from '@navikt/next-logger';

/**
 * This function is called when the Next.js server instance is bootstrapped.
 */
export const register = async () => {
    logger.info("Validating FhirConfiguration");
    new FhirConfiguration() // This will throw if the configuration is invalid
};
