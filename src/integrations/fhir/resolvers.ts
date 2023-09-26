// This module has various resolver functions for converting a FHIR R4 datatype into a representation we want.

import {
    AddressTypeKind,
    AddressUseKind,
    ContactPointSystemKind,
    ContactPointUseKind,
    HumanNameUseKind,
    IAddress,
    IContactPoint,
    IdentifierUseKind,
    IHumanName,
    IIdentifier,
    IPeriod
} from "@ahryman40k/ts-fhir-types/lib/R4";
import DatePeriod from "@/models/DatePeriod";
import Address from "@/models/Address";

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
    return { fom: start, tom: end }
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
    if(period === undefined || period.fom === undefined) {
        return undefined
    }
    return date.getTime() >= period.fom.getTime() &&
        (period.tom === undefined || date.getTime() <= period.tom?.getTime())
}


export const officialHumanNameResolver = (names: IHumanName[] | undefined): IHumanName | undefined => {
    if (names === undefined) {
        return undefined
    }
    // Try resolving to one name. Select the first official name among current names if there is one, otherwise
    // select first official among all given names, or just use the first one in
    // the array if no official name is found.
    const currentNames = names.filter(n => isDateWithinPeriod(new Date(), dateTimePeriodResolver(n.period)));
    return currentNames.find(n => n.use === HumanNameUseKind._official) ??
        names.find(n => n.use === HumanNameUseKind._official) ??
        names?.[0];
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

/**
 * Try resolving one postal address from the given addresses array.
 * @param addresses
 */
export const postalAddressResolver = (addresses: IAddress[] | undefined): Address | undefined => {
    if (addresses === undefined) {
        return undefined
    }
    // Exclude addresses marked as "old"
    const notOld = addresses.filter(address => address.use !== AddressUseKind._old);
    // Look for addresses currently valid if there is given period info on them
    const currentAddresses = notOld.filter(address => isDateWithinPeriod(new Date(), dateTimePeriodResolver(address.period)));
    const postalAddresses =
        currentAddresses.filter(address => address.type === AddressTypeKind._postal || address.type === AddressTypeKind._both) ??
        notOld.filter(address => address.type === AddressTypeKind._postal || address.type === AddressTypeKind._both)
    const chosenAddress = postalAddresses[0] ?? currentAddresses[0] ?? notOld[0];
    if (chosenAddress !== undefined) {
        return {
            gateadresse: chosenAddress.line?.[0],
            gateadresse2: chosenAddress.line?.[1],
            postkode: chosenAddress.postalCode,
            by: chosenAddress.city,
        }
    } else {
        return undefined;
    }
}

export const phoneContactResolver = (telecoms: IContactPoint[] | undefined): string | undefined => {
    if (telecoms === undefined) {
        return telecoms
    }
    // Exclude contact info that is not a phone number, and those marked old
    const onlyPhonesNotOld = telecoms.filter(t => t.system === ContactPointSystemKind._phone && t.use !== ContactPointUseKind._old)
    // Prefer the ones with active period if such info is given
    const currentPhones = onlyPhonesNotOld.filter(phone => isDateWithinPeriod(new Date(), dateTimePeriodResolver(phone.period)))
    const phonesRankedReducer = (prevPhone: IContactPoint, currentPhone: IContactPoint) => ((prevPhone.rank ?? 0) >= (currentPhone.rank ?? 0)) ? prevPhone : currentPhone;
    const chosenPhone = currentPhones.length > 1 ?
        currentPhones.reduce(phonesRankedReducer) :
        currentPhones[0] ??
        onlyPhonesNotOld.length > 1 ?
            onlyPhonesNotOld.reduce(phonesRankedReducer) :
            onlyPhonesNotOld[0]

    return chosenPhone?.value
}