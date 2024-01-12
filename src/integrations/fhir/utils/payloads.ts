import { DocumentReferenceStatusKind, IDocumentReference_Content } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { LegeerklaeringDokumentReferanse } from "@/models/LegeerklaeringDokumentReferanse";

const dipsDokumentType = "1001535"

export const createAndValidateDocumentReferencePayload = (
    patientIdentifier: string,
    practitionerRoleIdentifier: string,
    organizationIdentifier: string,
    documentReferenceStatus: DocumentReferenceStatusKind,
    description: LegeerklaeringDokumentReferanse,
    content: Array<IDocumentReference_Content>
) => validateOrThrow(R4.RTTI_DocumentReference.decode(
    {
        "resourceType": "DocumentReference",
        "status": documentReferenceStatus,
        "type": {
            "coding": [
                {
                    "system": "http://dips.no/fhir/namingsystem/dips-documenttypeid",
                    "code": `${dipsDokumentType}`
                }
            ]
        },
        "subject": {
            "reference": `Patient/${patientIdentifier}`,
            "identifier": {
                "system": "http://dips.no/fhir/namingsystem/dips-patientid",
                "value": "2015801"
            }
        },
        "author": [
            {
                "reference": `PractitionerRole/${practitionerRoleIdentifier}`,
                "identifier": {
                    "system": "urn:oid:1.3.6.1.4.1.9038.51.1",
                    "value": "1000755"
                }
            }
        ],
        "custodian": {
            // TODO: This should be changed to the department identifier for the practitioner
            "reference": `Organization/afa1000145`,
            "identifier": {
                "system": "http://dips.no/fhir/namingsystem/dips-organizationid",
                "value": "22"
            }
        },
        "description": description,
        "content": content
    }
));
