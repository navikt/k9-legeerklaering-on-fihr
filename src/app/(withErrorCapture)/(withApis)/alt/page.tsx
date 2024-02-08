import CenterColumn from "@/app/components/CenterColumn";
import NextLink from "next/link";
import { isSimulationAllowed } from "@/utils/environment";

export const dynamic = 'force-dynamic'

const Page = () => {
    return <CenterColumn>
        <h1>Alternative implementasjoner</h1>
        <p className="pb-4">
            For utprøving av ulike konsept kan du her velge ulike implementasjoner av brukergrensesnitt.
        </p>
        <ul className="bulletlist my-4">
            <li>
                <NextLink href="/">Direkte til skjema for nyregistrering, opprinneleg versjon</NextLink>
            </li>
            <li>
                <NextLink href="/alt/portalpoc">Legeerklæring: Pleiepenger for sykt barn startside alternativ 1</NextLink>
            </li>
        </ul>

        { isSimulationAllowed() ? <>
            <h2 className="pt-4">Simulert api</h2>
            <p className="py-4">
                For å prøve scenarioer som er vanskelig å sette opp i reelt api, eller koble til api uten å være inne i
                dips, kan du <NextLink href="/simulation"> velge simulert api her</NextLink>.
            </p>
        </> : null }
    </CenterColumn>
}

export default Page;