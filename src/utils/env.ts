import { logger } from '@navikt/next-logger';
import * as yup from "yup";

export type ServerEnv = yup.InferType<typeof serverEnvSchema>
export const serverEnvSchema = yup.object().shape({
    // FHIR
    FHIR_CLIENT_ID: yup.string().required(),
    FHIR_SUBSCRIPTION_KEY: yup.string().required(),
    FHIR_BASE_URL: yup.string().required(),

    // Helseopplysninger Server
    HELSEOPPLYSNINGER_SERVER_BASE_URL: yup.string().required(),
    HELSEOPPLYSNINGER_SERVER_SCOPE: yup.string().required(),

    // Flagg
    SIMULATION_ALLOWED: yup.boolean().required(),
    SYNTHETIC_IDENTIFIER_ALLOWED: yup.boolean().required()
});

const getRawServerConfig = () =>
    ({
        FHIR_CLIENT_ID: process.env.FHIR_CLIENT_ID,
        FHIR_SUBSCRIPTION_KEY: process.env.FHIR_SUBSCRIPTION_KEY,
        FHIR_BASE_URL: process.env.FHIR_BASE_URL,
        HELSEOPPLYSNINGER_SERVER_BASE_URL: process.env.HELSEOPPLYSNINGER_SERVER_BASE_URL,
        HELSEOPPLYSNINGER_SERVER_SCOPE: process.env.HELSEOPPLYSNINGER_SERVER_SCOPE,
        SIMULATION_ALLOWED: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" || process.env.SIMULATION_ALLOWED === "true",
        SYNTHETIC_IDENTIFIER_ALLOWED: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" || process.env.SYNTHETIC_IDENTIFIER_ALLOWED === "true"
    }) satisfies Partial<ServerEnv>

/**
 * Server envs are lazy loaded and verified using Yup.
 */
export function getServerEnv(): ServerEnv {
    try {
        return {...serverEnvSchema.validateSync(getRawServerConfig())}
    } catch (e) {
        if (e instanceof yup.ValidationError) {
            const error = new Error(
                `The following envs are missing: ${
                    e.errors.join(', ') || 'None are missing, but yup is not happy.'
                }`, {
                    cause: e
                }
            );
            logger.error(error, 'Error while parsing server envs')
            throw error
        } else {
            logger.error(e, 'Error while parsing server envs')
            throw e
        }
    }
}
