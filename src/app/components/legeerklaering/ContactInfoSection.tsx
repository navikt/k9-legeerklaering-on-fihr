import Section from "@/app/components/Section";
import {BodyLong, Link} from "@navikt/ds-react";
import React from "react";

export default function ContactInfoSection() {
    return (
        <Section title="Kontakt oss">
            <BodyLong>
                Har du flere spørsmål eller behov for mer veiledning? Her finner du mer <Link
                target="_blank"
                href="https://www.nav.no/samarbeidspartner/pleiepenger-barn#legeerklering-pleiepenger"> informasjon
                for helsepersonell om pleiepenger for sykt barn</Link>. Du kan også ringe oss på telefon 55 55 33 36.
            </BodyLong>
        </Section>
    )
}