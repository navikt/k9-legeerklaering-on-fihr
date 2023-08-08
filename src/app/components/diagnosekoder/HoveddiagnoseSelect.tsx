"use client"

import {Button, Label} from "@navikt/ds-react";
import {PencilIcon, TrashIcon} from "@navikt/aksel-icons";
import React, {ReactNode, useId, useRef, useState} from "react";
import DiagnosekodeSearchModal from "@/app/components/diagnosekoder/DiagnosekodeSearchModal";

import dkCss from './diagnosekoder.module.css';
import ErrorMessager from "@/app/components/diagnosekoder/ErrorMessager";
import type Diagnosekode from "@navikt/diagnosekoder/Diagnosekode";

export interface HoveddiagnoseSelectProps {
    readonly value?: Diagnosekode;
    readonly onChange: (diagnosekode: Diagnosekode | undefined) => void;
    readonly className?: string;
    readonly error?: ReactNode;
}

/*
 * Lets the user search for and select zero or one main diagnoses. Made for the LegeerklaeringForm form component.
 * Since it is currently not a required field in LegeerklaeringForm there is no possible user errors, and so support for
 * validation/displaying error message has not been added yet.
 */
const HoveddiagnoseSelect = ({value, onChange, className, error}: HoveddiagnoseSelectProps) => {
    const [showModal, setShowModal] = useState(false);
    const id = useId(); // Id to make label htmlFor happy
    const selectBtnRef = useRef<HTMLButtonElement>(null)

    // When user has selected a diagnose in the modal, we close the modal and trigger onChange event with chosen value.
    const handleSelectedDiagnose = (dk: Diagnosekode) => {
        setShowModal(false);
        onChange(dk);
    };
    const handleRemoveDiagnose = () => onChange(undefined)

    // When user clicks on the "base input", we want to focus the select button
    const handleInputClick = () => {
        selectBtnRef.current?.focus();
    }

    const Divider = () => value ? <span>&nbsp;-&nbsp;</span> : null;
    const showModalBtnText = value === undefined ? 'Velg' : 'Endre';

    // Always have the navds--form-field class first, then any provided by user, then the inputWrapper
    // navds-form-field was added to get styling of ErrorMessage to match the aksel components.
    const classNames = ["navds-form-field", className, dkCss.inputwrapper].filter(c => c !== undefined).join(" ")
    return (
        <div className={classNames}>
            <Label htmlFor={id}>Hoveddiagnose</Label>
            <div className={dkCss.framedline} onClick={handleInputClick}>
                <div className={dkCss.value}><span>{value?.code}</span><Divider /><span>{value?.text}</span></div>
                <Button id={id} type="button" ref={selectBtnRef} variant="tertiary" size="small"
                        onClick={() => setShowModal(true)} icon={<PencilIcon />}>
                    { showModalBtnText }
                </Button>
                <Button disabled={value === undefined} type="button" variant="tertiary" size="small"
                        onClick={handleRemoveDiagnose}  icon={<TrashIcon />}>
                    Fjern
                </Button>
            </div>
            <ErrorMessager error={error} />
            <DiagnosekodeSearchModal open={showModal} onClose={() => setShowModal(false)} onSelectedDiagnose={handleSelectedDiagnose} />
        </div>
    )
}

export default HoveddiagnoseSelect;