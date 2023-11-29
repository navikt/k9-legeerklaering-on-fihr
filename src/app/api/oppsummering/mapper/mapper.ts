import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';


// som navn
const somNavn = (navn: string): Navn => {
    const navnArray = navn.split(",");
    return {
        fornavn: navnArray[1],
        etternavn: navnArray[0],
    };
};

export const mapTilPSBLegeerklæringInnsending = (data: LegeerklaeringData): PSBLegeerklæringInnsending => {
    return ({
        legeerklæring: {
            pasient: {
                navn: somNavn(data.barn.name),
                id: data.barn.fnr,
                fødselsdato: data.barn.birthDate,
            },
            vurdering: data.legensVurdering,
            vurderingAvOmsorgspersoner: data.vurderingAvOmsorgspersoner,
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
            navn: somNavn(data.lege.name),
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
};
