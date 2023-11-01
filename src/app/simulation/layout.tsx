import ChildrenProp from "@/utils/ChildrenProp";
import { isSimulationAllowed } from "@/utils/environment";
import SimulationNotAllowed from "@/app/components/simulation/SimulationNotAllowed";

export const dynamic = 'force-dynamic'

const Layout= ({children}: ChildrenProp) => {
    return isSimulationAllowed() ? children : SimulationNotAllowed()
}

export default Layout