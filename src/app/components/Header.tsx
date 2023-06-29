"use client";

import { Dropdown, InternalHeader } from '@navikt/ds-react';
import React, { useState } from 'react';
import Client from 'fhirclient/lib/Client';
import { oauth2 as SMART } from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

export default function Header() {
    const [client, setClient] = useState<Client>(undefined!);

    React.useEffect(() => {
        SMART.ready()
            .then(c => {
                if (client === undefined) {
                    setClient(c);
                    console.log("client", c);
                }
            })
    }, [])

    return (
        <header>
            <InternalHeader className="flex justify-between">
                <InternalHeader.Title as="h1">Legeerklæring - pleiepenger sykt barn</InternalHeader.Title>
                {client?.getUserId() && (
                    <Dropdown>
                        <InternalHeader.UserButton
                            as={Dropdown.Toggle}
                            name={client.getUserId() ?? "Ukjent"}
                            className="ml-auto"
                        />
                    </Dropdown>
                )}
            </InternalHeader>
        </header>
    )
}
