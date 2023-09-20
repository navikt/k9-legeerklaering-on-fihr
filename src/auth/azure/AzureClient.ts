import getAuthClient from '@navikt/next-auth-wonderwall/dist/auth/azure/client';
import { BaseClient } from 'openid-client';
import { logger } from '@navikt/next-logger';

export default class AzureClient {
    private _client!: BaseClient;

    constructor() {
        logger.info("Initializing AzureClient...")
        getAuthClient()
            .then((baseClient: BaseClient) => this._client = baseClient)
            .catch((error: Error) => {
                logger.error(error, "Error initializing AzureClient")
                throw error
            })
        logger.info("AzureClient initialized")
    }

    get client(): BaseClient {
        return this._client;
    }
}
