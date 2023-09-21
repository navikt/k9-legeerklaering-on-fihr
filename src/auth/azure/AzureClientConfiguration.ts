import getAuthClient from '@navikt/next-auth-wonderwall/dist/auth/azure/client';
import { logger } from '@navikt/next-logger';
import { BaseClient, TokenSet } from 'openid-client';

export default class AzureClientConfiguration {
    private static _client: BaseClient | null = null;

    static async getClient(): Promise<BaseClient> {
        if (this._client) {
            return this._client;
        }

        try {
            logger.info("Initializing AzureClient...");
            this._client = await getAuthClient();
            logger.info("AzureClient initialized");
            return this._client;
        } catch (error) {
            logger.error(error, "Error initializing AzureClient");
            throw new Error("Error initializing AzureClient");
        }
    }

    static getServerHelseToken = async (): Promise<TokenSet> => {
        const client = await this.getClient();
        logger.info("Getting server token...");
        const handle = await client.deviceAuthorization({scope: process.env.HELSEOPPLYSNINGER_SERVER_SCOPE});
        const tokenSet = await handle.poll();
        logger.info(tokenSet, "Server token retrieved");
        return tokenSet;
    };
}
