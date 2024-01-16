import { NextRequest } from 'next/server';
import { logRequest } from '@/utils/loggerUtils';
import { logger } from '@navikt/next-logger';
import { FakeHelseopplysningerApi1 } from "@/app/simulation/fakeHelseopplysningerApi1";
import HelseopplysningerClient from "@/integrations/helseopplysningerserver/HelseopplysningerClient";
import { PSBLegeerklæringInnsending } from "@/integrations/helseopplysningerserver/types/HelseopplysningerTypes";

const initHelseopplysningerApi = () => process.env.FAKE_HELSEOPPLYSNINGER === "fake1" ?
    new FakeHelseopplysningerApi1() :
    new HelseopplysningerClient()

export const POST = async (request: NextRequest): Promise<Response> => {
    logRequest(request);
    logger.info("Registrerer legeerklæring...");
    const innsending = await request.json() as PSBLegeerklæringInnsending;

    const helseopplysningerApi = initHelseopplysningerApi()

    const pdfBlob = await helseopplysningerApi.generatePdf(innsending)
    return new Response(pdfBlob)
}
