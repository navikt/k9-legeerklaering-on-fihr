import DiagnosekodeSearch, { OnSelectedDiagnose } from "@/app/components/diagnosekoder/DiagnosekodeSearch";
import { Heading, Modal } from "@navikt/ds-react";

import diagnosekoderCss from './diagnosekoder.module.css';
import { componentSize } from '@/utils/constants';

export interface DiagnosekodeSearchModalProps extends OnSelectedDiagnose {
    readonly open: boolean;
    readonly onClose: () => void;
}

const DiagnosekodeSearchModal = (props: DiagnosekodeSearchModalProps) => {
    return (
        <Modal open={props.open} onClose={props.onClose} aria-labelledby="diagnosekode-modal-heading" >
            <Modal.Body className={diagnosekoderCss.modal}>
                <Heading size={componentSize} id="diagnosekode-modal-heading" className={diagnosekoderCss.heading}>Velg diagnosekode</Heading>
                <DiagnosekodeSearch onSelectedDiagnose={props.onSelectedDiagnose} />
            </Modal.Body>
        </Modal>
    )
}

export default DiagnosekodeSearchModal;
