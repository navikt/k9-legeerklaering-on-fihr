import {Button, Label} from "@navikt/ds-react";
import {PencilIcon, TrashIcon} from "@navikt/aksel-icons";
import React, {useId, useRef, useState} from "react";
import {Diagnosekode} from "@/app/api/diagnosekoder/ICD10";
import DiagnosekodeSearchModal from "@/app/components/diagnosekoder/DiagnosekodeSearchModal";

import dkCss from './diagnosekoder.module.css';

export interface HoveddiagnoseSelectProps {
    readonly value?: Diagnosekode;
    readonly onChange: (diagnosekode: Diagnosekode | undefined) => void;
}

const HoveddiagnoseSelect = ({value, onChange}: HoveddiagnoseSelectProps) => {
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

    return (
        <div className={dkCss.inputwrapper}>
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
            <DiagnosekodeSearchModal open={showModal} onClose={() => setShowModal(false)} onSelectedDiagnose={handleSelectedDiagnose} />
        </div>
    )
}

export default HoveddiagnoseSelect;