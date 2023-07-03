"use client"

import { createContext, useEffect, useState } from "react";
import Client from "fhirclient/lib/Client";
import { IPatient, IPractitioner } from '@ahryman40k/ts-fhir-types/lib/R4';
import { oauth2 } from 'fhirclient';

interface IClientContext {
    client: Client,
    patient: IPatient,
    practitioner: IPractitioner,
    error: Error,
}

export const FHIRContext = createContext<Partial<IClientContext>>({});

export const FhirContextProvider = (props: any) => {
    const [client, setClient] = useState<Client>();
    const [patient, setPatient] = useState<IPatient>();
    const [practitioner, setPractitioner] = useState<IPractitioner>();
    const [error, setError] = useState<Error>();

    useEffect(() => {
        async function fetchData() {
            // Provider standalone launch
            await oauth2.init({
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
            });
            const readyClient = await oauth2.ready();
            setClient(readyClient);

            if (readyClient) {
                const [p, u] = await Promise.all([
                    readyClient.patient.read(),
                    readyClient.user.read()
                ]);
                setPatient(p as IPatient);
                setPractitioner(u as IPractitioner);
            }
        }

        try {
            fetchData()
        } catch (e: Error | any) {
            setError(e)
        }

    }, []);

    const context = {client, patient, practitioner, error} as IClientContext;

    return (
        <>
            <FHIRContext.Provider value={context}>
                {props.children}
            </FHIRContext.Provider>
        </>
    );
};
