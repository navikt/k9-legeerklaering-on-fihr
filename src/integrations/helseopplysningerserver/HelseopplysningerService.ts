import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';
import { logger } from '@navikt/next-logger';
import { getServerEnv } from '@/utils/env';
import AzureClientConfiguration from '@/auth/azure/AzureClientConfiguration';

export default class HelseopplysningerService {
    private baseUrl: string;

    constructor() {
        const {HELSEOPPLYSNINGER_SERVER_BASE_URL} = getServerEnv();
        this.baseUrl = HELSEOPPLYSNINGER_SERVER_BASE_URL;
    }

    public async generatePdf(data: LegeerklaeringData): Promise<Response> {
        logger.info("Genererer PDF...");
        const tokenSet = await AzureClientConfiguration.getServerHelseToken();
        try {
            const pdfResponse = await fetch(`${this.baseUrl}/dev/pdf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenSet.access_token}`
                },
                body: JSON.stringify({
                    legeerklæring: {
                        pasient: {
                            navn: {
                                fornavn: data.barn.name,
                                etternavn: data.barn.name,
                            },
                            id: data.barn.fnr,
                            fødselsdato: data.barn.birthDate,
                        },
                        vurdering: data.legensVurdering,
                        hoveddiagnose: {
                            term: data.hoveddiagnose?.text,
                            kode: data.hoveddiagnose?.code,
                        },
                        bidiagnoser: data.bidiagnoser.map(bidiagnose => ({
                            term: bidiagnose.text,
                            kode: bidiagnose.code,
                        })),
                        tilsynsPerioder: data.tilsynPerioder.map(tilsyn => ({
                            fom: tilsyn.start,
                            tom: tilsyn.end,
                        })),
                        innleggelsesPerioder: data.innleggelsesPerioder.map(innleggelse => ({
                            fom: innleggelse.start,
                            tom: innleggelse.end,
                        }))
                    },
                    lege: {
                        navn: {
                            fornavn: data.lege.name,
                            etternavn: data.lege.name,
                        },
                        hpr: data.lege.hprNumber,
                    },
                    sykehus: {
                        navn: data.sykehus.name,
                        telefonnummer: data.sykehus.phoneNumber,
                        adresse: {
                            gateadresse: data.sykehus.address?.line1,
                            gateadresse2: data.sykehus.address?.line2,
                            postkode: data.sykehus.address?.postalCode,
                            by: data.sykehus.address?.city,
                        }
                    }
                })
            })
            if (pdfResponse.ok) return pdfResponse;
            else throw new Error(`Unexpected status code when fetching pdf (${pdfResponse.status} - ${pdfResponse.statusText}).`, {
                cause: await pdfResponse.text()
            })
        } catch (error) {
            logger.error(error, "Error generating PDF");
            throw new Error("Error generating PDF");
        }
    }
}
