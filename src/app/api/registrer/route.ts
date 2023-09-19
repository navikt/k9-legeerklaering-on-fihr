import { NextRequest } from 'next/server';
import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';
import { logRequest } from '@/utils/loggerUtils';
import { logger } from '@navikt/next-logger';
import PdfGeneratorService from '@/integrations/pdf/PdfGeneratorService';

export const POST = async (request: NextRequest): Promise<Response> => {
    logRequest(request);
    const data = await request.json() as LegeerklaeringData;
    logger.info(data, "Registrerer legeerklæring ->");
    return new PdfGeneratorService().generatePdf(data);
}
