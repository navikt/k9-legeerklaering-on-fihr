import Hospital from "@/models/Hospital";
import LabeledLines, { LabeledLine } from "@/app/components/label-listing/LabeledLines";

export interface HospitalListingProps {
    readonly hospital: Hospital | undefined;
}

const HospitalListing = ({hospital}: HospitalListingProps) => {
    const lines: LabeledLine[] = [
        {label: "Navn:", value: hospital?.name},
        {label: "Adresse:", value: hospital?.address?.line1},
    ]
    if (hospital?.address?.line2 !== undefined) {
        lines.push({label: "Adresse 2:", value: hospital.address.line2})
    }
    lines.push({label: "Postnr/sted:", value: `${hospital?.address?.postalCode} ${hospital?.address?.city}`.trim()})
    lines.push({label: "Telefon:", value: hospital?.phoneNumber})
    lines.push({label: "Org. nr:", value: hospital?.organizationNumber})

    return <LabeledLines lines={lines} />
}

export default HospitalListing;