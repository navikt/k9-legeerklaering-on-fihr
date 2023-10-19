'use client'

import { FhirApi } from "@/integrations/fhir/FhirApi";
import InitData from "@/models/InitData";
import delay from "@/utils/delay";
import ChildrenProp from "@/utils/ChildrenProp";
import { useAsyncInit } from "@/app/hooks/useAsyncInit";
import TopBar from "./TopBar";
import React from "react";
import { BaseApi, BaseApiContext, useBaseApi } from "@/app/simulation/portalpoc/BaseApi";

export const dynamic = 'force-dynamic';

class Fake1FhirApi implements FhirApi {
    async getInitState(): Promise<InitData> {
        await delay(1000);
        return {
            patient: {
                name: "Fake Kid1",
                birthDate: new Date("2019-03-16"),
                identifier: "fakepatient-1"
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

const initApi = async () => {
    await delay(3000)
    return new Fake1FhirApi()
}

const Layout = ({children}: ChildrenProp) => {
    const fhirApi = useAsyncInit(initApi)
    const baseApi: BaseApi = useBaseApi(fhirApi)

    return <>
        <TopBar loading={baseApi.loading} refreshInitData={baseApi.refreshInitData} user={baseApi.initData?.practitioner} />
        <BaseApiContext.Provider value={baseApi}>
            {children}
        </BaseApiContext.Provider>
    </>
}

export default Layout;