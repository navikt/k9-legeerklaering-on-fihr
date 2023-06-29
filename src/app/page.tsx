"use client";

import "@navikt/ds-css";
import { GuidePanel } from '@navikt/ds-react';
import Header from '@/app/components/Header';
import { oauth2 as SMART } from "fhirclient"
import React, { useState } from 'react';
import Client from 'fhirclient/lib/Client';
import { fhirclient } from 'fhirclient/lib/types';
import Patient = fhirclient.FHIR.Patient;


export default function Home() {
    const [client, setClient] = useState<Client>(undefined!);
    const [loading, setLoading] = useState<boolean>(false);
    const [patientIds, setPatientIds] = useState<string[] | undefined>(undefined);

    React.useEffect(() => {
        // Provider standalone launch
        SMART.init({
            iss:
                "https://launch.smarthealthit.org/v/r4/sim/WzIsIjlkYTdkOGMyLWRhZWYtNDcyMi04MzJlLWRjZjQ5NWQxM2E0ZSwxZmM1MzkxNy02YmMxLTRmODctOTAwOC1jOTFlOTRmMGUxODgsZDYzYWJmNjItMGY4NC00NjQ5LTk0ZDItMDUyZDkzNjNhYzAwIiwiZTQ0M2FjNTgtOGVjZS00Mzg1LThkNTUtNzc1YzFiOGYzYTM3IiwiQVVUTyIsMCwwLDAsIiIsIiIsIiIsIiIsIiIsIiIsIiIsMCwxXQ/fhir",
            redirectUri: "/",
            clientId: "whatever",
            scope: "patient/*.* user/*.* launch/patient launch/encounter openid fhirUser profile offline_access",
            // WARNING: completeInTarget=true is needed to make this work in the codesandbox
            // frame. It is otherwise not needed if the target is not another frame or window
            // but since the entire example works in a frame here, it gets confused without
            // setting this!
            completeInTarget: true
        })
            .then(client => {
                if (client === undefined) setClient(client);

                // Fetch MedicationRequest and Patient in parallel to load the app faster
                return Promise.all([
                    client.patient.read(),
                ]);
            })
            .then((patients: Awaited<Patient>[]) => {
                const ids = patients.map(p => p.id!!);
                if (ids.length !== 0 && patientIds === undefined) {
                    setPatientIds(ids);
                }
            })
            .catch(reason => {
                console.error("--> Reason", reason);
            })
    },)


    return (
        <div>
            <Header/>
            <GuidePanel className="m-12">
                Her kan du registrere digitalt legeerklæring for pleiepenger sykt barn.
            </GuidePanel>


            {patientIds !== undefined && patientIds.length !== 0 && (
                <ul>
                    {patientIds.map(id => <li key={id}>Pasient: {id}</li>)}
                </ul>
            )}
        </div>
    )
}
