interface AddresseInfo {
    gateadresse: string;
    gateadresse2?: string;
    postkode: string;
    by: string;
}

interface Diagnose {
    term: string;
    kode: string;
}

interface PSBLegeerklæringInnsending {
    legeerklæring: PSBLegeerklæring;
    lege: Lege;
    sykehus: Sykehus;
}

interface Lege {
    navn: Navn;
    hpr: string;
}

interface Navn {
    fornavn: string;
    etternavn: string;
}

interface PSBLegeerklæring {
    pasient: Pasient;
    omsorgspersoner: Omsorgsperson[];
    vurdering: string;
    hoveddiagnose: Diagnose;
    bidiagnoser: Diagnose[];
    tilsynsPerioder: Periode[];
    innleggelsesPerioder: Periode[];
}

interface Sykehus {
    navn: string;
    telefonnummer: string;
    adresse: AddresseInfo;
}

interface Pasient {
    navn: Navn;
    id: string;
    fødselsdato: Date;
}

interface Omsorgsperson {
    navn: Navn;
    id: string;
}

interface Periode {
    fom: Date;
    tom: Date;
}
