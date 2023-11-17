'use client'
import { setFakeFhirApiName } from "./fakeFhirApiFlag";

const Page = () => {
    return <div className="mx-auto mt-2 max-w-4xl p-4">
        <h1>Simulation</h1>
        <p className="pb-4">
            Denne siden brukes til å starte ulike simulerte scenarioer for utviklingstesting.
        </p>
        <p className="pb-4">
            Noen av simuleringene bruker testinstans av reelle api, andre bruker lokalt simulerte api kall/responser.
        </p>

        <h2 className="pt-4">Legeerklæring i Open Dips sandkasse</h2>
        <ul className="bulletlist my-4">
            <li>
                <a href="/?iss=https://api.dips.no/fhir&launch=cdp1000807&simulation=opendips-RolandGundersen">
                    Roland Gundersen
                </a>
            </li>
            <li>
                <a href="/?iss=https://api.dips.no/fhir&launch=cdp1000813&simulation=opendips-LineDanser">
                    Line Danser
                </a>
            </li>
            <li>
                <a href="/?iss=https://api.dips.no/fhir&launch=cdp2008909&simulation=opendips-GulPenn">
                    Gul Penn
                </a>
            </li>
            <li>
                <a href="/?iss=https://api.dips.no/fhir&launch=cdp2015831&simulation=opendips-Monika">
                    Monika (har omsorgsperson)
                </a>
            </li>
            <li>
                <a href="/?iss=https://api.dips.no/fhir&launch=cdp2012929&simulation=opendips-D-nr-Test0264">
                    Test0264 (har D-nummer)
                </a>
            </li>
            <li>
                <a href="/?iss=https://api.dips.no/fhir&launch=cdp2019153&simulation=opendips-BetydeligFjellkjede">
                    Betydelig Fjellkjede (syntetisk fødselsnummer +40)
                </a>
            </li>

        </ul>

        <h2 className="pt-4">Lokalt simulerte api <small>(Krever ikke noe api tilgang)</small></h2>
        <ul className="bulletlist my-4">
            <li>
                <a onClick={() => setFakeFhirApiName("fake1")} href="/">Fake Kid1</a>
            </li>
        </ul>
    </div>
}

export default Page;
