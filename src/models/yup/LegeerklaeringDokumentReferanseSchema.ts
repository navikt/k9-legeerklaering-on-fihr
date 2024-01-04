import { StringSchema } from "yup";
import {
    isLegeerklaeringDokumentReferanse,
    LegeerklaeringDokumentReferanse
} from "@/models/LegeerklaeringDokumentReferanse";

/**
 * Brukt for å få korrekt typing av LegeerklaeringDokumentReferanse i yup validator.
 */
export class LegeerklaeringDokumentReferanseSchema extends StringSchema<LegeerklaeringDokumentReferanse> {
    override isType(v: unknown): v is LegeerklaeringDokumentReferanse {
        return typeof v === 'string' && isLegeerklaeringDokumentReferanse(v)
    }
}

export const legeerklaeringDokumentReferanseSchema = () => new LegeerklaeringDokumentReferanseSchema()