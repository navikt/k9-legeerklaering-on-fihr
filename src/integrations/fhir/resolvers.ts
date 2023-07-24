// This module has various resolver functions for converting a FHIR R4 datatype into a representation we want.

import {HumanNameUseKind, IdentifierUseKind, IHumanName, IIdentifier, IPeriod} from "@ahryman40k/ts-fhir-types/lib/R4";
import DatePeriod from "@/models/DatePeriod";

/**
 * https://hl7.org/fhir/R4/datatypes.html#dateTime
 */
export const dateTimeResolver = (value?: string): Date | undefined => {
    if (value === undefined) {
        return undefined
    }
    // This is a first naive implementation. Should probably do more massaging of the input to ensure we get a correct
    // value, since the standard has some specific rules about how to work with a partial date time value.
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) {
        throw new Error(`${value} could not be resolved to a valid Date`);
    }
    return d;
}

export const dateTimePeriodResolver = (period?: IPeriod): DatePeriod | undefined => {
    if (period === undefined) {
        return undefined
    }
    const start = dateTimeResolver(period.start)
    const end = dateTimeResolver(period.end)
    return { start, end }
}

/**
 * Check if a given date is within a period.
 *
 * Start and end dateTimes are inclusive. If end is not defined, it is interpreted as being not set/in the future, so
 * then only the start date matters.
 *
 * If period is undefined, or the start date is undefined, we cannot determine a result and returns undefined.
 *
 * https://hl7.org/fhir/R4/datatypes.html#Period
 */
export const isDateWithinPeriod = (date: Date, period: DatePeriod | undefined): boolean | undefined => {
    if(period === undefined || period.start === undefined) {
        return undefined
    }
    return date.getTime() >= period.start.getTime() &&
        (period.end === undefined || date.getTime() <= period.end?.getTime())
}


export const officialHumanNameResolver = (names: IHumanName[] | undefined): string | undefined => {
    if (names === undefined) {
        return undefined
    }
    // Try resolving to one name. Select the first official name among current names if there is one, otherwise
    // select firt official among all given names, or just use the first one in
    // the array if no official name is found.
    const currentNames = names.filter(n => isDateWithinPeriod(new Date(), dateTimePeriodResolver(n.period)));
    const name1 =
        currentNames.find(n => n.use === HumanNameUseKind._official) ??
        names.find(n => n.use === HumanNameUseKind._official) ??
        names?.[0];
    return  `${name1?.prefix ?? ""} ${name1?.family ?? ""}, ${name1?.given?.join(" ") ?? ""}`
}
/**
 * Try resolving one identifier from the current identifiers in given array, or including all given if not found among current ones.
 * Return the first one found with tag "official" if there is one.
 * Otherwise, return the first "usual" one if there is one.
 * Otherwise, return the first identifier found regardless of its period or use tag.
 */
export const officialIdentifierResolver = (identifiers: IIdentifier[] | undefined): string | undefined => {
    if (identifiers === undefined) {
        return undefined
    }
    // Look for identifiers currently valid first, then including all previous identifiers too.
    const currentIdentifiers = identifiers.filter(identifier => isDateWithinPeriod(new Date(), dateTimePeriodResolver(identifier.period)))
    const identifier =
        currentIdentifiers.find(identifier => identifier.use === IdentifierUseKind._official) ??
        identifiers.find(identifier => identifier.use === IdentifierUseKind._official) ??
        currentIdentifiers.find(identifier => identifier.use === IdentifierUseKind._usual) ??
        identifiers.find(identifier => identifier.use === IdentifierUseKind._usual) ??
        identifiers[0]
    return identifier.value
}
