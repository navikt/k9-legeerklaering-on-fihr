import { Validation } from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';

export const validateOrThrow = <T>(validation: Validation<T>): T => {
    if (validation._tag === "Right") {
        return validation.right
    } else {
        throw new Error(`FHIR data validation error: ${PathReporter.report(validation).join("\n")}`);
    }
}
