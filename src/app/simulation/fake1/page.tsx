'use client';

import LegeerklaeringPage from "@/app/components/legeerklaering/LegeerklaeringPage";
import { FhirApi } from "@/integrations/fhir/FhirApi";
import InitData from "@/models/InitData";
import delay from "@/utils/delay";

class Fake1FhirApi implements FhirApi {
    async getInitState(): Promise<InitData> {
        await delay(1000);
        return {
            patient: {
                name: "Fake Kid1",
                birthDate: new Date("2019-03-16"),
                identifier: "fakepatient-1",
                caretakers: []
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

const Page = () => {
    const api: FhirApi = new Fake1FhirApi()

    return <LegeerklaeringPage api={api} simulationName="fake1" />
}

export default Page;