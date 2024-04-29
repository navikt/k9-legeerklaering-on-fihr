import LoadingIndicator, { loadingTxt } from "@/app/components/legeerklaering/LoadingIndicator";
import ErrorDisplay from "@/app/components/legeerklaering/ErrorDisplay";
import { ReactNode } from "react";
import ensureError from "@/utils/ensureError";
import InitData from "@/models/InitData";
import { BaseApi } from "@/app/(withErrorCapture)/(withApis)/BaseApi";

export interface InitDataDependentRenderProps {
    readonly baseApi: BaseApi;
    render(initData: InitData): ReactNode;
}

const InitDataDependentRender = ({baseApi, render}: InitDataDependentRenderProps) => {
    if (baseApi.loading !== false) {
        return <LoadingIndicator txt={loadingTxt(baseApi.loading)} />
    } else if (baseApi.error !== null) {
        return <ErrorDisplay error={baseApi.error} heading="Feil i forbindelse med journalsystem" />
    } else if (baseApi.initData !== null) {
        return render(baseApi.initData)
    } else {
        return <ErrorDisplay
            error={ensureError("Invalid BaseApi state: Neither loading, error or initData is set")}
            heading="Systemfeil, lukk og åpne vinduet på nytt" />
    }
}

export default InitDataDependentRender;