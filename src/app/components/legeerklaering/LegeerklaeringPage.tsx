'use client';

import LegeerklaeringForm, { EhrInfoLegeerklaeringForm } from "@/app/components/legeerklaering/LegeerklaeringForm";
import React from "react";
import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';


export interface LegeerklaeringPageProps {
    data: EhrInfoLegeerklaeringForm;
    handleFormSubmit: (submittedData: LegeerklaeringData) => void;
}

const LegeerklaeringPage = ({data, handleFormSubmit}: LegeerklaeringPageProps) => {
    const onFormSubmit = (submittedData: LegeerklaeringData) => {
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
