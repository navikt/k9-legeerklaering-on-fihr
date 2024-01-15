import { HelseopplysningerApi } from "@/integrations/helseopplysningerserver/HelseopplysningerApi";
import { fakePdf } from "@/app/simulation/fakePdf";

/**
 * A fake implementation of the client for helseopplysninger server, for local development/testing without having to
 * connect to a real server.
 */
export class FakeHelseopplysningerApi1 implements HelseopplysningerApi {

    async generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Blob> {
        return await fakePdf()
    }
}

const fakeHelseopplysningerApi1 = () => new FakeHelseopplysningerApi1()

export default fakeHelseopplysningerApi1