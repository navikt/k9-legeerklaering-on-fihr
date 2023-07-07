import { InternalHeader } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { FHIRContext } from '@/app/context/FHIRContext';

type HeaderState = {
    practitionerName: string | undefined;
    practitionerId: string | undefined;
}

export default function Header() {
    const {practitioner, client} = useContext(FHIRContext);
    const [headerState, setHeaderState] = useState<HeaderState>()

    useEffect(() => {
        if (!practitioner) {
            console.log('Data is not yet available');
        } else {
            console.log('Data is available', {practitioner});
            const name = practitioner?.name?.pop();
            console.log('1. Legens navn', {name});
            if (name) {
                setHeaderState({
                    practitionerName: `${name.prefix ?? ""} ${name.family}, ${name.given?.pop()}`,
                    practitionerId: practitioner?.id
                })
            }
        }
    }, [practitioner, headerState])

    return (
        <header>
            <InternalHeader className="flex justify-between">
                <InternalHeader.Title as="h1">Legeerklæring - pleiepenger sykt barn</InternalHeader.Title>
                {headerState?.practitionerName !== undefined && (
                    <InternalHeader.User
                        name={headerState.practitionerName}
                        description={`ID: ${headerState.practitionerId}`}
                        className="ml-auto"
                    />
                )}
            </InternalHeader>
        </header>
    )
}
