'use client';

import LegeerklaeringForm, { EhrInfoLegeerklaeringForm } from "@/app/components/legeerklaering/LegeerklaeringForm";
import React from "react";
import LegeerklaeringDokument from "@/models/LegeerklaeringDokument";


export interface LegeerklaeringPageProps {
    data: EhrInfoLegeerklaeringForm;
    handleFormSubmit: (submittedData: LegeerklaeringDokument) => void;
}

const LegeerklaeringPage = ({data, handleFormSubmit}: LegeerklaeringPageProps) => {
    const onFormSubmit = (submittedData: LegeerklaeringDokument) => {
        handleFormSubmit(submittedData);
    };

    return (
        <>
            <div>
                <LegeerklaeringForm
                    doctor={data.doctor}
                    patient={data.patient}
                    hospital={data.hospital}
                    onFormSubmit={onFormSubmit}
                />
            </div>
        </>
    )
}

export default LegeerklaeringPage;
