import { Tag } from "@navikt/ds-react";

import css from './SimulationIndicator.module.css';
import { FhirApi } from "@/integrations/fhir/FhirApi";

export interface SimulationIndicatorProps {
    readonly api: FhirApi | null;
}

const SimulationIndicator = ({api}: SimulationIndicatorProps) => {
    return api !== null && api.isSimulation ?
        <Tag className={css.tag} variant="info" size="small"><a href="/launchsimulation">Api simulering</a>&nbsp; aktiv: {api.apiName}</Tag> :
        null
}

export default SimulationIndicator;