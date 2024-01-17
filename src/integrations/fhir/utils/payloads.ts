import { DocumentReferenceStatusKind, IDocumentReference_Content } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { LegeerklaeringDokumentReferanse } from "@/models/LegeerklaeringDokumentReferanse";
import { DipsDepartmentReference } from "@/models/DipsDepartmentReference";

// Viss oppretting av DocumentReference returnerer feilmelding
// (This document can not be saved without having EPR groups set.), så kan det vere pga feil i oppsett av brukertilgang.
const dipsDokumentType = "-1001535"

export const createAndValidateDocumentReferencePayload = (
    patientIdentifier: string,
    practitionerRoleIdentifier: string,
    custodianReference: DipsDepartmentReference,
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
            "reference": `Patient/${patientIdentifier}`
        },
        "author": [
            {
                "reference": `PractitionerRole/${practitionerRoleIdentifier}`
            }
        ],
        "custodian": {
            "reference": custodianReference
        },
        "description": description,
        "content": content
    }
));
