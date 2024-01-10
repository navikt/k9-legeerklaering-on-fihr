"use client"

import { Box, Button, Label, ReadMore } from "@navikt/ds-react";
import { PlusIcon, TrashIcon } from "@navikt/aksel-icons";
import React, { ReactNode, useId, useRef, useState } from "react";
import type { Diagnosekode } from "@navikt/diagnosekoder";
import DiagnosekodeSearchModal from "@/app/components/diagnosekoder/DiagnosekodeSearchModal";

import dkCss from './diagnosekoder.module.css';
import ErrorMessager from "@/app/components/diagnosekoder/ErrorMessager";
import { componentSize } from '@/utils/constants';
import { tekst } from "@/utils/tekster";

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


    // Always have the navds--form-field class first, then any provided by user, then the inputWrapper
    // navds-form-field was added to get styling of ErrorMessage to match the aksel components.
    const classNames = ["navds-form-field", className, dkCss.inputwrapper].filter(c => c !== undefined).join(" ")
    return (
        <div className={classNames}>
            <Label size={componentSize} htmlFor={id}>Hoveddiagnose</Label>
            <ReadMore size={componentSize} header="Sett hoveddiagnose (ICD-10) hvis mulig">
                Hvis barnet er under utredning og det ikke er fastsatt noen diagnose trenger du ikke fylle ut dette.
            </ReadMore>
            <Box className={dkCss.framedlisting} onClick={handleInputClick}>
                {value &&
                    <div key={value.code} className={dkCss.line}>
                        <div className={dkCss.value}>
                            <span>{value.code}</span> - <span>{value.text}</span>
                        </div>
                        <Button type="button" variant="tertiary" size={componentSize}
                                icon={<TrashIcon/>}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    handleRemoveDiagnose()
                                }}>
                            Fjern
                        </Button>
                    </div>
                }

                {!value && <Button id={id} type="button" ref={selectBtnRef} variant="tertiary" size={componentSize}
                                   onClick={() => setShowModal(true)} icon={<PlusIcon/>}>
                    Legg til hoveddiagnose
                </Button>}
            </Box>
            <ErrorMessager error={error}/>
            <DiagnosekodeSearchModal open={showModal} onClose={() => setShowModal(false)}
                                     onSelectedDiagnose={handleSelectedDiagnose}/>
        </div>
    )
}

export default HoveddiagnoseSelect;
