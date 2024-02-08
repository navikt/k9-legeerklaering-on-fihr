'use client'

import ChildrenProp from "@/utils/ChildrenProp";
import TopBar from "./TopBar";
import React, { useContext } from "react";
import { BaseApi, BaseApiContext, useBaseApi } from "../../BaseApi";
import FhirApiContext from "@/app/(withErrorCapture)/(withApis)/FhirApiContext";

export const dynamic = 'force-dynamic';

const Layout = ({children}: ChildrenProp) => {
    const fhirApi = useContext(FhirApiContext)
    const baseApi: BaseApi = useBaseApi(fhirApi)

    return <>
        <TopBar loading={baseApi.loading} refreshInitData={baseApi.refreshInitData} user={baseApi.initData?.practitioner} />
        <BaseApiContext.Provider value={baseApi}>
            {children}
        </BaseApiContext.Provider>
    </>
}

export default Layout;