import { useContext } from 'react';
import { FHIRContext } from '@/app/context/FHIRContext';

export default function Legeerklaering() {
    const {patient} = useContext(FHIRContext);

    const patientName = patient?.name?.pop();
    return (
        <div>
            {patientName !== undefined && (
                <div>
                    <h1>Pasient data</h1>
                    <p>{`${patientName.prefix ?? ""} ${patientName.family}, ${patientName.given?.pop()}`}</p>
                </div>
            )}
        </div>
    );
}
