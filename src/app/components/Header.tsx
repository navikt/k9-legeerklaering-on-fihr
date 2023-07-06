
import { InternalHeader } from '@navikt/ds-react';
import React, { useContext, useEffect } from 'react';
import { FHIRContext } from '@/app/context/FHIRContext';

export default function Header() {
    const {practitioner} = useContext(FHIRContext);
    const practitionerName = practitioner?.name?.pop();

    useEffect(() => {

    }, [practitionerName])

    return (
        <header>
            <InternalHeader className="flex justify-between">
                <InternalHeader.Title as="h1">Legeerklæring - pleiepenger sykt barn</InternalHeader.Title>
                {practitionerName !== undefined && (
                    <InternalHeader.User
                        name={`${practitionerName.prefix ?? ""} ${practitionerName.family}, ${practitionerName.given?.pop()}`}
                        description={`ID: ${practitioner?.id}`}
                        className="ml-auto"
                    />
                )}
            </InternalHeader>
        </header>
    )
}
