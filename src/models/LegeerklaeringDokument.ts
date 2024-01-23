import Patient from "@/models/Patient";
import DatePeriod from "@/models/DatePeriod";
import Practitioner from "@/models/Practitioner";
import Hospital from "@/models/Hospital";
import { type Diagnosekode } from '@navikt/diagnosekoder'
import { LegeerklaeringDokumentReferanse } from "@/models/LegeerklaeringDokumentReferanse";
import { DipsDepartmentReference } from "@/models/DipsDepartmentReference";

export default interface LegeerklaeringDokument {
    readonly dokumentReferanse: LegeerklaeringDokumentReferanse;
    barn: Patient;
    vurderingAvBarnet: string;
    vurderingAvOmsorgspersoner: string;
    hoveddiagnose?: Diagnosekode;
    bidiagnoser: Diagnosekode[];
    tilsynPeriode: DatePeriod;
    innleggelsesPerioder: DatePeriod[];
    lege: Practitioner;
    sykehus: Hospital;
    readonly dokumentAnsvarlig: DipsDepartmentReference;
}
