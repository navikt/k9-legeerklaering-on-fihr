import { NextRequest } from 'next/server';
import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';
import { logRequest } from '@/utils/loggerUtils';
import { logger } from '@navikt/next-logger';
import HelseopplysningerService from '@/integrations/helseopplysningerserver/HelseopplysningerService';
import { mapTilPSBLegeerklæringInnsending } from '@/app/api/oppsummering/mapper/mapper';

export const POST = async (request: NextRequest): Promise<Response> => {
    logRequest(request);
    logger.info("Registrerer legeerklæring...");
    const data = await request.json() as LegeerklaeringData;

    const innsending = mapTilPSBLegeerklæringInnsending(data);
    return new HelseopplysningerService().generatePdf(innsending);
}
