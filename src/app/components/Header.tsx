import {InternalHeader} from '@navikt/ds-react';
import React from 'react';
import Doctor from "@/models/Doctor";

export interface HeaderProps {
    doctor: Doctor | undefined;
}

export default function Header({doctor}: HeaderProps) {
    return (
        <header>
            <InternalHeader className="flex justify-between">
                <InternalHeader.Title as="h1">Legeerklæring - pleiepenger sykt barn</InternalHeader.Title>
                { doctor !== undefined ?
                    <InternalHeader.User
                        name={doctor.name}
                        description={`ID: ${doctor.hprNumber}`}
                        className="ml-auto"
                    /> : null
                }
            </InternalHeader>
        </header>
    )
}
