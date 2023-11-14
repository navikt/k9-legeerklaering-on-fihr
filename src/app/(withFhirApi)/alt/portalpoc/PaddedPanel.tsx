import ChildrenProp from "@/utils/ChildrenProp";
import { Panel } from "@navikt/ds-react";

import css from "./PaddedPanel.module.css";

// Just a small wrapper to get a standard layout panel with the same styling around
const PaddedPanel = ({children}: ChildrenProp) => {
    return <Panel className={css.paddedParas}>
        {children}
    </Panel>
}

export default PaddedPanel;