import Patient from "@/models/Patient";
import DatePeriod from "@/models/DatePeriod";
import Practitioner from "@/models/Practitioner";
import Hospital from "@/models/Hospital";
import { type Diagnosekode } from '@navikt/diagnosekoder'
import RelatedPerson from '@/models/RelatedPerson';

export default interface LegeerklaeringData {
    barn: Patient;
    legensVurdering: string;
    vurderingAvOmsorgspersoner: string;
    hoveddiagnose?: Diagnosekode;
    bidiagnoser: Diagnosekode[];
    tilsynPeriode: DatePeriod; // TODO: Skal ikke være liste
    innleggelsesPerioder: DatePeriod[];
    lege: Practitioner;
    sykehus: Hospital;
    omsorgspersoner: RelatedPerson[]
}
