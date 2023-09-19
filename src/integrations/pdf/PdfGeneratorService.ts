import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';
import { logger } from '@navikt/next-logger';

export default class PdfGeneratorService {
    private baseUrl: string;

    constructor() {
        const {HELSEOPPLYSNINGER_PDF_BASE_URL} = process.env;
        if (!HELSEOPPLYSNINGER_PDF_BASE_URL) {
            const error = new Error("HELSEOPPLYSNINGER_PDF_BASE_URL is not defined.");
            logger.error(error, error.message);
            throw error;
        }
        this.baseUrl = HELSEOPPLYSNINGER_PDF_BASE_URL;
    }

    public async generatePdf(data: LegeerklaeringData): Promise<Response> {
        const pdfResponse = await fetch(`${this.baseUrl}/api/v1/genpdf/helseopplysninger/legeerklaering-pleienger-for-sykt-barn`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pasient: {
                    fornavn: data.barn.name,
                    personnummer: data.barn.identifier,
                    pårørende: [],
                    legeerklæring: {
                        vurdering: data.legensVurdering,
                        hoveddiagnose: {
                            diagnoseterm: data.hoveddiagnose?.text,
                            diagnosekode: data.hoveddiagnose?.code,
                        },
                        bidiagnoser: data.bidiagnoser.map(bidiagnose => ({
                            diagnoseterm: bidiagnose.text,
                            diagnosekode: bidiagnose.code,
                        })),
                        innleggelser: {
                            perioder: data.innleggelsesPerioder.map(innleggelse => ({
                                fom: innleggelse.start,
                                tom: innleggelse.end,
                            }))
                        },
                        tilsyn: {
                            perioder: data.tilsynPerioder.map(tilsyn => ({
                                fom: tilsyn.start,
                                tom: tilsyn.end,
                            }))
                        }
                    }
                },
                helsepersonell: {
                    fornavn: data.lege.name,
                    hpr: data.lege.hprNumber,
                    adresseInfo: {
                        navn: data.sykehus.name,
                        teleonnummer: data.sykehus.phoneNumber,
                        adresse: {
                            gateadresse: data.sykehus.address?.line1,
                            postkode: data.sykehus.address?.postalCode,
                            by: data.sykehus.address?.city,
                        }
                    },
                    signatur: null,
                }
            })
        })
        if (pdfResponse.ok) return pdfResponse;
        else throw new Error(`Unexpected status code when fetching pdf (${pdfResponse.status} - ${pdfResponse.statusText})`)
    }
}
