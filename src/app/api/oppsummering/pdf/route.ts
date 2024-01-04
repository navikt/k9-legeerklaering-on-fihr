import { NextRequest } from 'next/server';
import { logRequest } from '@/utils/loggerUtils';
import { logger } from '@navikt/next-logger';
import HelseopplysningerService from '@/integrations/helseopplysningerserver/HelseopplysningerService';
import { mapTilPSBLegeerklæringInnsending } from '@/app/api/oppsummering/mapper/mapper';
import LegeerklaeringDokument from "@/models/LegeerklaeringDokument";

export const POST = async (request: NextRequest): Promise<Response> => {
    logRequest(request);
    logger.info("Registrerer legeerklæring...");
    const data = await request.json() as LegeerklaeringDokument;

    const innsending = mapTilPSBLegeerklæringInnsending(data);
    return new HelseopplysningerService().generatePdf(innsending);
}
