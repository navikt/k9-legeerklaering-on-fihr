"use client"

import React, {ReactNode, useId, useRef, useState} from "react";
import {Button, Label} from "@navikt/ds-react";
import {PlusIcon, TrashIcon} from "@navikt/aksel-icons";
import DiagnosekodeSearchModal from "@/app/components/diagnosekoder/DiagnosekodeSearchModal";

import dkCss from './diagnosekoder.module.css';
import ErrorMessager from "@/app/components/diagnosekoder/ErrorMessager";
import type Diagnosekode from "@navikt/diagnosekoder/Diagnosekode";

export interface BidiagnoseSelectProps {
    readonly value: Diagnosekode[]
    readonly onChange: (diagnosekoder: Diagnosekode[]) => void;
    readonly className?: string;
    readonly error?: ReactNode;
}

export const appendNewDiagnosekode = (diagnosekoder: Diagnosekode[], newDiagnosekode: Diagnosekode): Diagnosekode[] => {
    const existsAlready = diagnosekoder.some(dk => dk.code === newDiagnosekode.code);
    if (existsAlready) {
        return diagnosekoder;
    } else {
        return [...diagnosekoder, newDiagnosekode]
    }
}

/**
 * Lets the user search for and select zero or more secondary diagnoses. Made for the LegeerklaeringForm form component.
 * Since it is currently not a required field in LegeerklaeringForm there is no possible user errors, and so support for
 * validation/displaying error message has not been added yet.
 */
const BidiagnoseSelect = ({value, onChange, className, error}: BidiagnoseSelectProps) => {
    const [showModal, setShowModal] = useState(false);
    const id = useId(); // Id to make label htmlFor happy
    const selectBtnRef = useRef<HTMLButtonElement>(null)

    const handleSelectedDiagnose = (dk: Diagnosekode) => {
        setShowModal(false);
        onChange(appendNewDiagnosekode(value, dk))
    };
    const handleRemovedDiagnose = (removed: Diagnosekode) => {
        onChange(value.filter(dk => dk.code !== removed.code))
    }

    // When user clicks on the "base input", we want to focus the select button
    const handleInputClick = () => {
        selectBtnRef.current?.focus();
    }

    // Always have the navds--form-field class first, then any provided by user, then the inputWrapper
    // navds-form-field was added to get styling of ErrorMessage to match the aksel components.
    const classNames = ["navds-form-field", className, dkCss.inputwrapper].filter(c => c !== undefined).join(" ")

    return (
        <div className={classNames}>
            <Label htmlFor={id}>Bidiagnose</Label>
            <div className={dkCss.framedlisting} onClick={handleInputClick}>
                {value.map(dk => {
                    return (
                        <div key={dk.code} className={dkCss.line}>
                            <div className={dkCss.value}>
                                <span>{dk.code}</span> - <span>{dk.text}</span>
                            </div>
                            <Button disabled={value === undefined} type="button" variant="tertiary" size="small" icon={<TrashIcon />}
                                    onClick={(ev) => {ev.stopPropagation(); handleRemovedDiagnose(dk)}}>
                                Fjern
                            </Button>
                        </div>
                    )
                })}
                <Button id={id} type="button" ref={selectBtnRef} variant="tertiary" size="small"
                        onClick={() => setShowModal(true)} icon={<PlusIcon />}>
                    Legg til <u>bi</u>diagnose
                </Button>
            </div>
            <ErrorMessager error={error} />
            <DiagnosekodeSearchModal open={showModal} onClose={() => setShowModal(false)} onSelectedDiagnose={handleSelectedDiagnose} />
        </div>
    )
}

export default BidiagnoseSelect;