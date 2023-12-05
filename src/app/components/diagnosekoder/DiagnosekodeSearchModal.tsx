import DiagnosekodeSearch, { OnSelectedDiagnose } from "@/app/components/diagnosekoder/DiagnosekodeSearch";
import { Modal } from "@navikt/ds-react";

import diagnosekoderCss from './diagnosekoder.module.css';

export interface DiagnosekodeSearchModalProps extends OnSelectedDiagnose {
    readonly open: boolean;
    readonly onClose: () => void;
}

const DiagnosekodeSearchModal = (props: DiagnosekodeSearchModalProps) => {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="diagnosekode-modal-heading"
            header={{
                heading: "Velg diagnosekode",
                size: "small",
                closeButton: true,
            }}
        >
            <Modal.Body className={diagnosekoderCss.modal}>
                <DiagnosekodeSearch onSelectedDiagnose={props.onSelectedDiagnose}/>
            </Modal.Body>
        </Modal>
    )
}

export default DiagnosekodeSearchModal;
