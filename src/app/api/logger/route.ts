import pino, { BaseLogger } from "pino";
import { logger } from '@navikt/next-logger';
import { NextRequest, NextResponse } from 'next/server';

type LogLevels = Exclude<keyof BaseLogger, 'string' | 'level'>;

const levels: Record<LogLevels, LogLevels> = {
    "error": "error",
    "debug": "debug",
    "fatal": "fatal",
    "info": "info",
    "trace": "trace",
    "silent": "silent",
    "warn": "warn",
} as const;

function isValidLoggingLabel(label: unknown): label is LogLevels {
    return typeof label === "string" && label in levels;
}

export const POST = async (request: NextRequest, response: NextResponse): Promise<NextResponse<unknown>> => {
    const data = await request.json() as pino.LogEvent;
    const {level, ts}: pino.LogEvent = data;
    const label: unknown = level.label;
    if (!isValidLoggingLabel(label)) {
        return new NextResponse(null, {
            status: 400,
            statusText: 'Bad Request',
        });
    }

    const messages = data.messages as [objOrMsg: unknown, msgOrArgs?: string];

    logger
        .child({
            x_timestamp: ts,
            x_isFrontend: true,
            x_userAgent: request.headers.get('user-agent') ?? 'not-set',
            x_request_id: request.headers.get('x-request-id') ?? 'not-set',
        })
        [label](...messages);

    return new NextResponse(null, {
        status: 200,
        statusText: 'OK'
    });
}
