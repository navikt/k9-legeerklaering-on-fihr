import Patient from "@/models/Patient";
import {Diagnosekode} from "@/app/api/diagnosekoder/Diagnosekode";
import DatePeriod from "@/models/DatePeriod";
import Doctor from "@/models/Doctor";
import Hospital from "@/models/Hospital";

export default interface LegeerklaeringData {
    barn: Patient;
    legensVurdering: string;
    hoveddiagnose: Diagnosekode | undefined;
    bidiagnoser: Diagnosekode[];
    tilsynPerioder: DatePeriod[];
    innleggelsesPerioder: DatePeriod[];
    lege: Doctor;
    sykehus: Hospital;
}