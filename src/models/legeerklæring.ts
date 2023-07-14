import {Diagnosekode} from "@/app/api/diagnosekoder/ICD10";

export type Periode = {
    fra: Date;
    til: Date;
}

export type Barn = {
    navn: string;
    ident: string;
    foedselsdato?: Date;
}

export type Lege = {
    navn: string;
    hrpNummer: string;
}

export type Adresse = {
    gate: string;
    postnummer: string;
    poststed: string;
}

export type Sykehus = {
    navn: string;
    telefon: string;
    adresse: Adresse;
}

export type LegeerklaeringFormData = {
    barn: Barn;
    legensVurdering: string;
    hoveddiagnose?: Diagnosekode;
    bidiagnoser: Diagnosekode[];
    tilsynPeriode: Periode;
    innleggelsesPeriode: Periode;
    lege: Lege;
    sykehus: Sykehus;
};