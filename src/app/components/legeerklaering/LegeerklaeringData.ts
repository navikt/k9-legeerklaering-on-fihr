import Patient from "@/models/Patient";
import DatePeriod from "@/models/DatePeriod";
import Doctor from "@/models/Doctor";
import Hospital from "@/models/Hospital";
import { type Diagnosekode } from '@navikt/diagnosekoder'

export default interface LegeerklaeringData {
    pasient: Patient;
    vurdering: string;
    hoveddiagnose?: Diagnosekode;
    bidiagnoser: Diagnosekode[];
    tilsynsPerioder: DatePeriod[];
    innleggelsesPerioder: DatePeriod[];
    lege: Doctor;
    sykehus: Hospital;
}
