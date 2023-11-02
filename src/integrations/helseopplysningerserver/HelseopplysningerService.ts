import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';
import { logger } from '@navikt/next-logger';
import { getServerEnv } from '@/utils/env';
import AzureClientConfiguration from '@/auth/azure/AzureClientConfiguration';

export default class HelseopplysningerService {
    private baseUrl: string;
    private azureClient: AzureClientConfiguration

    constructor() {
        const {HELSEOPPLYSNINGER_SERVER_BASE_URL} = getServerEnv();
        this.baseUrl = HELSEOPPLYSNINGER_SERVER_BASE_URL;
        this.azureClient = new AzureClientConfiguration();
    }

    public async generatePdf(data: LegeerklaeringData): Promise<Response> {
        logger.info("Genererer PDF...");
        const tokenSet = await AzureClientConfiguration.getServerHelseToken();
        const pdfResponse = await fetch(`${this.baseUrl}/pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenSet.access_token}`
            },
            body: JSON.stringify({
                legeerklæring: {
                    pasient: {
                        navn: {
                            fornavn: data.pasient.navn.fornavn,
                            etternavn: data.pasient.navn.etternavn,
                        },
                        id: data.pasient.fnr,
                        fødselsdato: data.pasient.fødselsdato,
                    },
                    vurdering: data.vurdering,
                    hoveddiagnose: data.hoveddiagnose,
                    bidiagnoser: data.bidiagnoser.map(bidiagnose => ({
                        term: bidiagnose.text,
                        kode: bidiagnose.code,
                    })),
                    tilsynsPerioder: data.tilsynsPerioder.map(tilsyn => ({
                        fom: tilsyn.fom,
                        tom: tilsyn.tom,
                    })),
                    innleggelsesPerioder: data.innleggelsesPerioder.map(innleggelse => ({
                        fom: innleggelse.fom,
                        tom: innleggelse.tom,
                    }))
                },
                lege: {
                    navn: {
                        fornavn: data.lege.navn.fornavn,
                        etternavn: data.lege.navn.etternavn,
                    },
                    hpr: data.lege.hpr,
                },
                sykehus: {
                    navn: data.sykehus.navn,
                    telefonnummer: data.sykehus.tlf,
                    adresse: {
                        gateadresse: data.sykehus.adresse?.gateadresse,
                        gateadresse2: data.sykehus.adresse?.gateadresse2,
                        postkode: data.sykehus.adresse?.postkode,
                        by: data.sykehus.adresse?.by,
                    }
                }
            })
        })
        if (pdfResponse.ok) return pdfResponse;
        else throw new Error(`Unexpected status code when fetching pdf (${pdfResponse.status} - ${pdfResponse.statusText})`)
    }
}
