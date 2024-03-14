import 'server-only';
import { logger } from '@navikt/next-logger';
import { Client, BaseClient, ClientMetadata, Issuer, TokenSet } from 'openid-client';
import { getServerEnv } from "@/utils/env";


const requireEnvValueString = (key: string): string => {
    const v = process.env[key]
    if(v !== undefined && v.length > 0) {
        return v
    }
    throw new Error(`env variable ${key} not set, or empty. Check nais deployment config`)
}

const getConfig = () => {
    const clientId = requireEnvValueString("AZURE_APP_CLIENT_ID")
    const clientSecret = requireEnvValueString("AZURE_APP_CLIENT_SECRET")
    const discoveryUrl = requireEnvValueString("AZURE_APP_WELL_KNOWN_URL")
    return {
        clientId,
        clientSecret,
        discoveryUrl,
    }
}

let _issuer: Issuer<Client> | null = null
const getIssuer = async (): Promise<Issuer<Client>> => {
    if (_issuer === null) {
        const config = getConfig()
        _issuer = await Issuer.discover(config.discoveryUrl)
    }
    return _issuer
}

let _client: BaseClient | null = null
const getClient = async (): Promise<BaseClient> => {
    if(_client === null) {
        const config = getConfig()
        const metadata: ClientMetadata = {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            token_endpoint_auth_method: 'client_secret_post',
            response_types: ['code'],
            response_mode: 'query',
        }
        const issuer = await getIssuer()
        _client = new issuer.Client(metadata)
    }
    return _client
}

const getServerHelseToken = async (): Promise<TokenSet> => {
    try {
        const client = await getClient()
        return client.grant({
            grant_type: "client_credentials",
            scope: getServerEnv().HELSEOPPLYSNINGER_SERVER_SCOPE,
        })
    } catch (e) {
        logger.error(e, "error getting helse server token")
        throw e
    }
}

export default getServerHelseToken