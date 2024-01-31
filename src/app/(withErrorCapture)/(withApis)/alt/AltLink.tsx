import NextLink from "next/link";
import { SandboxIcon } from "@navikt/aksel-icons";
import css from "./AltLink.module.css";

const AltLink = () => {
    return <NextLink href="/alt" className={css.link} title="Alternativer"><SandboxIcon title="Alternativer" fontSize="1.5rem" /></NextLink>
}

export default AltLink