import { createContext } from "react";
import { AsyncInit } from "@/app/hooks/useAsyncInit";
import { FhirApi } from "@/integrations/fhir/FhirApi";

const valueNotSetError = {
    initError: new Error(`ApiContext was used without setting a new api instance value`)
}

const ApiContext = createContext<AsyncInit<FhirApi>>(valueNotSetError);

export default ApiContext;
