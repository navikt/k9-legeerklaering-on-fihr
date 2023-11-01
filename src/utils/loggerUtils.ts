import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest } from 'next/server';
import { logger } from '@navikt/next-logger';

const maskedPathname = (nextUrl: NextURL): string => {
    // Replace the IDs in the pathname for Patient and Practitioner;
    return nextUrl.pathname.replace(/(\/api\/fhir\/proxy\/(Patient|Practitioner)\/)[^/]+/, '$1<masked>');
};

export const logRequest = (request: NextRequest) => {
    const {method, nextUrl} = request
    logger.info(`--> Request ${method} ${maskedPathname(nextUrl)}`)
};

export const logResponse = (nextUrl: NextURL, response: Response) => {
    const {status, statusText} = response
    logger.info(`<-- Response ${status} ${statusText} ${maskedPathname(nextUrl)}`)
};
