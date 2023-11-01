import { Tag } from "@navikt/ds-react";

import css from './SimulationIndicator.module.css';

export interface SimulationIndicatorProps {
    readonly simulationName?: string;
}

const SimulationIndicator = ({simulationName}: SimulationIndicatorProps) => {
    return simulationName !== undefined ?
        <Tag className={css.tag} variant="info" size="small"><a href="/simulation">Simulering aktiv</a>: {simulationName}</Tag> :
        null
}

export default SimulationIndicator;