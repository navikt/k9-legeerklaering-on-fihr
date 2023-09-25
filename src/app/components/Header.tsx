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
                        name={doctor.navn}
                        description={`ID: ${doctor.hpr}`}
                        className="ml-auto"
                    /> : null
                }
            </InternalHeader>
        </header>
    )
}
