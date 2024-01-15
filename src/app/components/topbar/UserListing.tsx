import LabeledLines, { LabeledLine } from "@/app/components/label-listing/LabeledLines";
import { CheckmarkCircleIcon, ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import css from "./TopBar.module.css";
import React from "react";
import { UserProps } from "./TopBar";

const UserListing = ({user}: UserProps) => {
    const lines: LabeledLine[] = [
        {label: "Navn:", value: user?.name},
        {label: "HPR:", value: user?.hprNumber},
        {label: "Aktiv:", value: user?.activeSystemUser ?
                <CheckmarkCircleIcon title="Ja" fontSize="1.5rem" className={css.successColor} /> :
                <ExclamationmarkTriangleIcon title="Nei" fontSize="1rem" className={css.warningColor} /> },
    ]
    return <LabeledLines lines={lines} />
}

export default UserListing;
