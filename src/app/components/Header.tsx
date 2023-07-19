import {InternalHeader} from '@navikt/ds-react';
import React from 'react';
import {HumanNameUseKind, IPractitioner} from "@ahryman40k/ts-fhir-types/lib/R4";

export interface HeaderProps {
    practitioner?: IPractitioner;
}

export default function Header({practitioner}: HeaderProps) {
    const names = practitioner?.name; // The name prop is actually an array of name types
    // Try resolving to one name. Select the official name if there is one, otherwise just use the first one in the array (if there is one).
    const name1 = names?.find(n => n.use === HumanNameUseKind._official) ?? names?.[0];
    const userName =  `${name1?.prefix ?? ""} ${name1?.family ?? ""}, ${name1?.given?.join(" ") ?? ""}`
    return (
        <header>
            <InternalHeader className="flex justify-between">
                <InternalHeader.Title as="h1">Legeerklæring - pleiepenger sykt barn</InternalHeader.Title>
                { practitioner !== undefined ?
                    <InternalHeader.User
                        name={userName}
                        description={`ID: ${practitioner?.id}`}
                        className="ml-auto"
                    /> : null
                }
            </InternalHeader>
        </header>
    )
}
