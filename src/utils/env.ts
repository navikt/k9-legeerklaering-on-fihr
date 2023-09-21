import { z, ZodError } from 'zod';
import { logger } from '@navikt/next-logger';

export type ServerEnv = z.infer<typeof serverEnvSchema>
export const serverEnvSchema = z.object({
    // FHIR
    FHIR_CLIENT_ID: z.string(),
    FHIR_SUBSCRIPTION_KEY: z.string(),
    FHIR_BASE_URL: z.string(),
    // Helseopplysninger Server
    HELSEOPPLYSNINGER_SERVER_BASE_URL: z.string(),
    HELSEOPPLYSNINGER_SERVER_SCOPE: z.string(),
})

const getRawServerConfig = (): Partial<unknown> =>
    ({
        FHIR_CLIENT_ID: process.env.FHIR_CLIENT_ID,
        FHIR_SUBSCRIPTION_KEY: process.env.FHIR_SUBSCRIPTION_KEY,
        FHIR_BASE_URL: process.env.FHIR_BASE_URL,
        HELSEOPPLYSNINGER_SERVER_BASE_URL: process.env.HELSEOPPLYSNINGER_SERVER_BASE_URL,
        HELSEOPPLYSNINGER_SERVER_SCOPE: process.env.HELSEOPPLYSNINGER_SERVER_SCOPE
    }) satisfies Record<keyof ServerEnv, string | undefined>

/**
 * Server envs are lazy loaded and verified using Zod.
 */
export function getServerEnv(): ServerEnv {
    try {
        return { ...serverEnvSchema.parse(getRawServerConfig())}
    } catch (e) {
        if (e instanceof ZodError) {
            const error = new Error(
                `The following envs are missing: ${
                    e.errors
                        .filter((it) => it.message === 'Required')
                        .map((it) => it.path.join('.'))
                        .join(', ') || 'None are missing, but zod is not happy. Look at cause'
                }`,
                { cause: e },
            );
            logger.error(error, 'Error while parsing server envs')
            throw error
        } else {
            logger.error(e, 'Error while parsing server envs')
            throw e
        }
    }
}
