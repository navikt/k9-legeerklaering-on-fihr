import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';
import {logger} from '@navikt/next-logger';

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
                legeerklæring: {
                    pasient: {
                        navn: {
                            fornavn: data.pasient.navn.fornavn,
                            etternavn: data.pasient.navn.etternavn,
                        },
                        fnr: data.pasient.fnr,
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
                    })),
                    lege: {
                        navn: {
                            fornavn: data.lege.navn.fornavn,
                            etternavn: data.lege.navn.etternavn,
                        },
                        hpr: data.lege.hpr,
                    },
                    sykehus: {
                        navn: data.sykehus.navn,
                        tlf: data.sykehus.tlf,
                        adresse: {
                            gateadresse: data.sykehus.adresse?.gateadresse,
                            gateadresse2: data.sykehus.adresse?.gateadresse2,
                            postkode: data.sykehus.adresse?.postkode,
                            by: data.sykehus.adresse?.by,
                        }
                    }
                }
            })
        })
        if (pdfResponse.ok) return pdfResponse;
        else throw new Error(`Unexpected status code when fetching pdf (${pdfResponse.status} - ${pdfResponse.statusText})`)
    }
}
