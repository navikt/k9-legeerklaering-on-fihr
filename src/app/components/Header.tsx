import { InternalHeader } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { FHIRContext } from '@/app/context/FHIRContext';

export default function Header() {
    const {practitioner, client} = useContext(FHIRContext);
    const [practitionerName, setPractitionerName] = useState<string>()
    const [practitionerId, setPractitionerId] = useState<string>()

    useEffect(() => {
        if (!practitioner) {
            console.log('Data is not yet available');
        } else {
            console.log('Data is available', {practitioner});
            const name = practitioner?.name?.pop();
            if (name) {
                setPractitionerName(`${name.prefix ?? ""} ${name.family}, ${name.given?.pop()}`)
            }
            setPractitionerId(practitioner?.id)
        }
    }, [practitioner, practitionerName, practitionerId])

    return (
        <header>
            <InternalHeader className="flex justify-between">
                <InternalHeader.Title as="h1">Legeerklæring - pleiepenger sykt barn</InternalHeader.Title>
                {practitionerName !== undefined && (
                    <InternalHeader.User
                        name={practitionerName}
                        description={`ID: ${practitionerId}`}
                        className="ml-auto"
                    />
                )}
            </InternalHeader>
        </header>
    )
}
