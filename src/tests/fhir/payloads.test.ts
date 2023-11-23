import { DocumentReferenceStatusKind } from '@ahryman40k/ts-fhir-types/lib/R4';
import { createAndValidateDocumentReferencePayload } from '@/integrations/fhir/utils/payloads';

describe("FHIR DocumentReference Resource Validation", () => {
    it("should create a valid DocumentReference without throwing errors", () => {
        expect(() => createAndValidateDocumentReferencePayload(
            "123",
            "456",
            "az123",
            DocumentReferenceStatusKind._current,
            [
                {
                    "attachment": {
                        "contentType": "application/pdf",
                        "data": "string",
                        "title": "title",
                    }
                }
            ]
        )).not.toThrow();
    });
});

