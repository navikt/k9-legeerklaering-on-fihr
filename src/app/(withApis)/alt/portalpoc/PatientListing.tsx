import Patient from "@/models/Patient";
import LabeledLines, { LabeledLine } from "@/app/components/label-listing/LabeledLines";

export interface PatientListingProps {
    readonly patient: Patient | undefined;
}

const PatientListing = ({patient}: PatientListingProps) => {
    const lines: LabeledLine[] = [
        {label: "Navn:", value: patient?.name},
        {label: "Fødselsdato:", value: patient?.birthDate?.toLocaleDateString()},
        {label: "Fødselsnummer/D-nummer:", value: patient?.fnr},
    ]
    return <LabeledLines lines={lines} />
}

export default PatientListing;