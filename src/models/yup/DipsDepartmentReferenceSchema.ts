import { StringSchema } from "yup";
import { DipsDepartmentReference, isDipsDepartmentReference } from "@/models/DipsDepartmentReference";

export class DipsDepartmentReferenceSchema extends StringSchema<DipsDepartmentReference> {
    override isType(v: unknown): v is DipsDepartmentReference {
        return typeof v === 'string' && isDipsDepartmentReference(v)
    }
}

export const dipsDepartmentReferenceSchema = () => new DipsDepartmentReferenceSchema()