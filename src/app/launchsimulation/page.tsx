
export default function Launchsimulation() {
    return (
        <div className="mx-auto mt-2 max-w-4xl p-4">
            <h1>Launch simulation</h1>
            <p>Her kan du simulere åpning av legeerklæringsskjema fra EHR systemet (Dips).</p>
            <p>Velg pasient.</p>
            <ol className="mt-4">
                <li>
                    <a href="/?iss=https://api.dips.no/fhir&launch=cdp1000807">
                        Roland Gundersen
                    </a>
                </li>
                <li>
                    <a href="/?iss=https://api.dips.no/fhir&launch=cdp1000813">
                        Line Danser
                    </a>
                </li>
                <li>
                    <a href="/?iss=https://api.dips.no/fhir&launch=cdp2008909">
                        Gul Penn
                    </a>
                </li>
            </ol>
        </div>
    )
}
