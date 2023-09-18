import { NextApiRequest, NextApiResponse } from "next";
import pino, { BaseLogger } from "pino";
import { logger } from '@/utils/logger';

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

export const POST = (request: NextApiRequest, response: NextApiResponse): void => {
    const { level, ts }: pino.LogEvent = request.body;
    const label: unknown = level.label;
    if (!isValidLoggingLabel(label)) {
        response.status(400).json({ error: `Invalid label ${label}` });
        return;
    }

    const messages: [objOrMsg: unknown, msgOrArgs?: string] = request.body.messages;

    logger
        .child({
            x_timestamp: ts,
            x_isFrontend: true,
            x_userAgent: request.headers['user-agent'],
            x_request_id: request.headers['x-request-id'] ?? 'not-set',
        })
        [label](...messages);

    response.status(200).json({ ok: `ok` });
}
