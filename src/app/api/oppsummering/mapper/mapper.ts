import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';

export const mapTilPSBLegeerklæringInnsending = (data: LegeerklaeringData): PSBLegeerklæringInnsending => ({
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
} as PSBLegeerklæringInnsending);
