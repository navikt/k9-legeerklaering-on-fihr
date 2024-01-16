import { HelseopplysningerApi } from "@/integrations/helseopplysningerserver/HelseopplysningerApi";
import {readFile} from "node:fs/promises";
import {resolve} from "node:path";
import { PSBLegeerklæringInnsending } from "@/integrations/helseopplysningerserver/types/HelseopplysningerTypes";

/**
 * A fake implementation of the client for helseopplysninger server, for local development/testing without having to
 * connect to a real server.
 */
export class FakeHelseopplysningerApi1 implements HelseopplysningerApi {

    async generatePdf(innsending: PSBLegeerklæringInnsending): Promise<Blob> {
        const path = resolve('./src/app/simulation/fake-generated.pdf')
        const content = await readFile(path)
        return new Blob([content], {type: "application/pdf"})
    }
}

const fakeHelseopplysningerApi1 = () => new FakeHelseopplysningerApi1()

export default fakeHelseopplysningerApi1