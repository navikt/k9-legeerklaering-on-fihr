import DiagnosekodeSearch, {OnSelectedDiagnose} from "@/app/components/diagnosekoder/DiagnosekodeSearch";
import {Heading, Modal} from "@navikt/ds-react";
import {useEffect} from "react";

import diagnosekoderCss from './diagnosekoder.module.css';

export interface DiagnosekodeSearchModalProps extends OnSelectedDiagnose {
    readonly open: boolean;
    readonly onClose: () => void;
}

const DiagnosekodeSearchModal = (props: DiagnosekodeSearchModalProps) => {
    useEffect(() => {
        Modal.setAppElement(document.body);
    });
    return (
        <Modal open={props.open} onClose={props.onClose} aria-labelledby="diagnosekode-modal-heading" >
            <Modal.Content className={diagnosekoderCss.modal}>
                <Heading size="medium" id="diagnosekode-modal-heading" className={diagnosekoderCss.heading}>Velg diagnosekode</Heading>
                <DiagnosekodeSearch onSelectedDiagnose={props.onSelectedDiagnose} />
            </Modal.Content>
        </Modal>
    )
}

export default DiagnosekodeSearchModal;