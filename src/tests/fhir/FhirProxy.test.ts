import { FhirProxy } from "@/integrations/fhir/FhirProxy";

describe("FhirProxy", () => {
    const fhirBaseUrl = "https://api.example.com/fhir"
    const proxy = new FhirProxy(
        fhirBaseUrl,
        "not-a-real-key",
        "test-key-header-name",
        "/api/fhir/proxy",
    )
    const incomingUrl = new URL("http://localhost:3000/api/fhir/proxy/Patient/cdp1000807")
    const expectedRewrittenUrl = fhirBaseUrl + "/Patient/cdp1000807"
    test("rewriteIncomingPath should create correct path", () => {
        expect(proxy.rewriteIncomingPath(incomingUrl.pathname))
            .toEqual(`/Patient/cdp1000807`)
    })

    test("urlPathAppend should fix missing/extra slashes in paths", () => {
        expect(proxy.urlPathAppend(fhirBaseUrl, "/Some/path")).toEqual(fhirBaseUrl + "/Some/path")
        expect(proxy.urlPathAppend(fhirBaseUrl + "/", "/Some/path")).toEqual(fhirBaseUrl + "/Some/path")
        expect(proxy.urlPathAppend(fhirBaseUrl + "/", "Some/path")).toEqual(fhirBaseUrl + "/Some/path")
        expect(proxy.urlPathAppend(fhirBaseUrl, "Some/path")).toEqual(fhirBaseUrl + "/Some/path")
    })

    test("rewriteIncomingUrl should create correct url", () => {
        expect(proxy.rewriteIncomingUrl(incomingUrl).toString()).toEqual(expectedRewrittenUrl)
    })
})