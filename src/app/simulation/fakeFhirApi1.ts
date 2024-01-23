import { FhirApi } from "@/integrations/fhir/FhirApi";
import InitData from "@/models/InitData";
import delay from "@/utils/delay";
import { LegeerklaeringDokumentReferanse } from "@/models/LegeerklaeringDokumentReferanse";
import { fakePdf } from "@/app/simulation/fakePdf";

class Fake1FhirApi implements FhirApi {
    private readonly fakeDocumentId = "fakeDocumentId"
    createDocument(patientEhrId: string, providerEhrId: string, hospitalEhrId: string, description: LegeerklaeringDokumentReferanse, pdf: Blob): Promise<string> {
        return Promise.resolve(this.fakeDocumentId) // Currently it doesn't matter what value is returned here, the other fake apis don't use it.
    }
    async getDocumentPdf(documentId: string): Promise<Blob> {
        if(documentId !== this.fakeDocumentId) {
            throw new Error(`Expected documentId to be ${this.fakeDocumentId}, was: ${documentId}`)
        }
        return await fakePdf()
    }

    async getInitState(): Promise<InitData> {
        await delay(1000);
        return {
            patient: {
                name: "Fake Kid1",
                birthDate: new Date("2019-03-16"),
                ehrId: "fakepatient-1",
                fnr: "06495227438",
            },
            practitioner: {
                name: "Fake doctor1",
                hprNumber: "9911",
                ehrId: "fakedoctor-1",
                practitionerRoleId: "pracRoleId-1",
                activeSystemUser: true,
                departmentReference: "Organization/afaFakeDepartment-1"
            },
            hospital: {
                name: "Fake hospital1",
                organizationNumber: "111222333",
                phoneNumber: "99887766",
                address: {
                    line1: "Fake hospital road 32",
                    postalCode: "9988",
                    city: "Fake city1",
                },
                ehrId: "fakehospital-1"
            }
        }
    }
}

export const initFakeFhirApi1 = async (): Promise<FhirApi> => {
    await delay(1000)
    return new Fake1FhirApi()
}
