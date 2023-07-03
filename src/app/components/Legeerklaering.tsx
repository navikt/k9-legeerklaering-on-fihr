import React, { useContext } from 'react';
import { FHIRContext } from '@/app/context/FHIRContext';
import { Panel } from '@navikt/ds-react';

export default function Legeerklaering() {
    const {patient, client} = useContext(FHIRContext);

    const patientName = patient?.name?.pop();
    return (
        <div>
            {client !== undefined && (
                <Panel border>
                    {patientName !== undefined && (
                        <div>
                            <h1>Pasient data</h1>
                            <p>{`${patientName.prefix ?? ""} ${patientName.family}, ${patientName.given?.pop()}`}</p>
                        </div>
                    )}
                </Panel>
            )}
        </div>
    );
}
