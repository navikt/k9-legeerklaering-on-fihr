import {ExpansionCard} from "@navikt/ds-react";
import {StethoscopeIcon} from "@navikt/aksel-icons";
import React from "react";

export default function AboutExpansionCard() {
return (
    <ExpansionCard aria-labelledby="AboutExpansionCardTitle" className="mt-8 mb-8">
        <ExpansionCard.Header>
            <div className="flex items-center space-x-4">
                <div className="text-6xl flex-shrink-0 grid place-content-center">
                    <StethoscopeIcon aria-hidden/>
                </div>
                <div>
                    <ExpansionCard.Title id="AboutExpansionCardTitle">Om legeerklæringen</ExpansionCard.Title>
                </div>
            </div>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
            <p className="mb-4">
                Legeerklæringen skal fylles ut av behandlende lege. Det er kun sykehusleger og leger i
                spesialisthelsetjenesten som kan skrive legeerklæring for pleiepenger for sykt barn.
            </p>
            <p>
                NAV trenger tidsnære opplysninger for å behandle søknad om pleiepenger. Det innebærer at NAV trenger
                oppdaterte medisinske opplysninger for åvurdere om vilkårene for rett til pleiepenger er oppfylt.
            </p>
        </ExpansionCard.Content>
    </ExpansionCard>
)

}
