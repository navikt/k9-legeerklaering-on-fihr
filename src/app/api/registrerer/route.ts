import { NextRequest } from 'next/server';
import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';
import { logRequest } from '@/utils/loggerUtils';
import { logger } from '@navikt/next-logger';
import HelseopplysningerService from '@/integrations/helseopplysningerserver/HelseopplysningerService';

export const POST = async (request: NextRequest): Promise<Response> => {
    logRequest(request);
    const data = await request.json() as LegeerklaeringData;
    logger.info("Registrerer legeerklæring...");
    return new HelseopplysningerService.generatePdf(data);
}
