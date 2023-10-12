import { getServerEnv } from "@/utils/env";
import { isSimulationAllowed } from "@/utils/environment";

const SimulationNotAllowed = () => {
    return (
        <div className="mx-auto mt-2 max-w-4xl p-4">
            <h1>Simulation not allowed</h1>
            <p>This deployment does not allow simulation of backends. This page is only meant to be used during development/testing.</p>
            <p>
                <a href="/">Back to start page.</a>
            </p>
        </div>
    )
}

export default function Launchsimulation() {
    const simulationIsAllowed: boolean = isSimulationAllowed()
    return simulationIsAllowed ? (
        <div className="mx-auto mt-2 max-w-4xl p-4">
            <h1>Launch simulation</h1>
            <p>Her kan du simulere åpning av legeerklæringsskjema fra EHR systemet (Dips).</p>
            <p>Velg pasient.</p>
            <ol className="mt-4">
                <li>
                    <a href="/?iss=https://api.dips.no/fhir&launch=cdp1000807&simulation=true">
                        Roland Gundersen
                    </a>
                </li>
                <li>
                    <a href="/?iss=https://api.dips.no/fhir&launch=cdp1000813&simulation=true">
                        Line Danser
                    </a>
                </li>
                <li>
                    <a href="/?iss=https://api.dips.no/fhir&launch=cdp2008909&simulation=true">
                        Gul Penn
                    </a>
                </li>
            </ol>
        </div>
    ): SimulationNotAllowed()
}
