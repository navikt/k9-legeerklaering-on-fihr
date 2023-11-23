import { FhirApi } from "@/integrations/fhir/FhirApi";
import InitData from "@/models/InitData";
import delay from "@/utils/delay";

class Fake1FhirApi implements FhirApi {
    createDocument(patientEhrId:string, providerEhrId:string, hospitalEhrId:string, pdf:Blob): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async getInitState(): Promise<InitData> {
        await delay(1000);
        return {
            patient: {
                name: "Fake Kid1",
                birthDate: new Date("2019-03-16"),
                ehrId: "fakepatient-1",
                fnr: "55101088734",
                caretakers: [
                    {ehrId: "ct001", name: "Fake mother1", fnr: "99223344500"},
                    {ehrId: "ct002", name: "Fake father1", fnr: "89723246505"},
                ]
            },
            practitioner: {
                name: "Fake doctor1",
                hprNumber: "9911",
                ehrId: "fakedoctor-1",
                activeSystemUser: true,
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

export const initFakeApi1 = async (): Promise<FhirApi> => {
    await delay(1000)
    return new Fake1FhirApi()
}
