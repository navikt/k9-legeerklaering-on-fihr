import Patient from "@/models/Patient";
import DatePeriod from "@/models/DatePeriod";
import Practitioner from "@/models/Practitioner";
import Hospital from "@/models/Hospital";
import { type Diagnosekode } from '@navikt/diagnosekoder'

export default interface LegeerklaeringData {
    barn: Patient;
    legensVurdering: string;
    vurderingAvOmsorgspersoner: string;
    hoveddiagnose?: Diagnosekode;
    bidiagnoser: Diagnosekode[];
    tilsynPerioder: DatePeriod[];
    innleggelsesPerioder: DatePeriod[];
    lege: Practitioner;
    sykehus: Hospital;
}
