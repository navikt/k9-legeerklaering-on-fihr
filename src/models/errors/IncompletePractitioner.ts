import { PartialPractitioner } from "@/models/Practitioner";

export default class IncompletePractitioner extends Error {

    public static resolveMessage(pp: PartialPractitioner): string {
        const missingProps = []
        if(pp.epjId === undefined) missingProps.push("epj system id")
        if(pp.hprNumber === undefined) missingProps.push("hpr nummer")
        if(pp.name === undefined) missingProps.push("name")
        return "Practitioner info incomplete: Undefined properties: " + missingProps.join(", ")
    }

    constructor(public readonly partialPractitioner: PartialPractitioner) {
        super(IncompletePractitioner.resolveMessage(partialPractitioner));
        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IncompletePractitioner)
        }
    }
}