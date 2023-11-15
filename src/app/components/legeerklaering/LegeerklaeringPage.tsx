'use client';

import LegeerklaeringForm, { EhrInfoLegeerklaeringForm } from "@/app/components/legeerklaering/LegeerklaeringForm";
import ContactInfoSection from "@/app/components/legeerklaering/ContactInfoSection";
import React from "react";
import LegeerklaeringData from '@/app/components/legeerklaering/LegeerklaeringData';
import { logger } from '@navikt/next-logger';


export interface LegeerklaeringPageProps {
    data: EhrInfoLegeerklaeringForm;
    handleFormSubmit: (submittedData: LegeerklaeringData) => void;
}

const LegeerklaeringPage = ({data, handleFormSubmit}: LegeerklaeringPageProps) => {
    const onFormSubmit = (submittedData: LegeerklaeringData) => {
        handleFormSubmit(submittedData);
        logger.info(submittedData, "Form data submitted");
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
                <ContactInfoSection/>
            </div>
        </>
    )
}

export default LegeerklaeringPage;
