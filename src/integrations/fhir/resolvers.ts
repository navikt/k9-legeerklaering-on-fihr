// This module has various resolver functions for converting a FHIR R4 datatype into a representation we want.

import {
    AddressTypeKind,
    AddressUseKind,
    ContactPointSystemKind,
    ContactPointUseKind,
    HumanNameUseKind,
    IAddress,
    IBundle,
    IContactPoint,
    IdentifierUseKind,
    IHumanName,
    IIdentifier,
    IPeriod,
    IPractitioner,
    IPractitionerRole,
    IResourceList
} from "@ahryman40k/ts-fhir-types/lib/R4";
import DatePeriod from "@/models/DatePeriod";
import Address from "@/models/Address";
import { R4 } from "@ahryman40k/ts-fhir-types";
import { HprNumber } from "@/models/HprNumber";
import { PartialPractitioner } from "@/models/Practitioner";

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
    // select first official among all given names, or just use the first one in
    // the array if no official name is found.
    const currentNames = names.filter(n => isDateWithinPeriod(new Date(), dateTimePeriodResolver(n.period)));
    const name1 =
        currentNames.find(n => n.use === HumanNameUseKind._official) ??
        names.find(n => n.use === HumanNameUseKind._official) ??
        names?.[0];
    const nameStr = `${name1?.prefix ?? ""} ${name1?.family ?? ""}, ${name1?.given?.join(" ") ?? ""}`.trim()
    return nameStr.length > 0 ? nameStr : undefined
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
            line1: chosenAddress.line?.[0],
            line2: chosenAddress.line?.[1],
            postalCode: chosenAddress.postalCode,
            city: chosenAddress.city,
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

/**
 * Extract the resource list from a bundle
 * @param bundle
 */
export const bundleResourceList = (bundle: IBundle): IResourceList[] =>
    bundle.entry !== undefined ?
        bundle.entry.flatMap(e => e.resource !== undefined ? [e.resource] : []) :
        []


/**
 * Return first resource of type IPractitionerRole from given resourcelisting.
 * @param resourcelisting
 */
export const iPractitionerRoleFromListing = (resourcelisting: IResourceList[]): IPractitionerRole | undefined => {
    for(const resource of resourcelisting) {
        if(R4.RTTI_PractitionerRole.is(resource)) {
            return resource
        }
    }
    return undefined
}

export const iPractitionerFromListing = (resourcelisting: IResourceList[]): IPractitioner | undefined => {
    for(const resource of resourcelisting) {
        if(R4.RTTI_Practitioner.is(resource)) {
            return resource
        }
    }
    return undefined
}

/**
 * Return first identifier of type "hpr nummer" from given list of identifiers.
 * "hpr number" is an official norwegian healthcare persons id-number. This has the OID "urn:oid:2.16.578.1.12.4.1.4.4".
 * https://www.ehelse.no/teknisk-dokumentasjon/oid-identifikatorserier-i-helse-og-omsorgstjenesten#Nasjonale%20identifikatorserier%20for%20personer
 */
export const hprNumberFromIdentifiers = (identifiers: IIdentifier[]): HprNumber | undefined => {
    for(const identifier of identifiers) {
        if(
            identifier.system === "urn:oid:2.16.578.1.12.4.1.4.4" &&
            identifier.use === IdentifierUseKind._official &&
            identifier.value !== undefined &&
            identifier.value.length > 0
        ) {
            return identifier.value
        }
    }
    return undefined;
}

export const organizationNumberFromIdentifier = (identifier: IIdentifier | undefined): string | undefined => {
    if(
        identifier !== undefined &&
        identifier.system === "urn:oid:2.16.578.1.12.4.1.4.101" &&
        identifier.use === IdentifierUseKind._official &&
        identifier.value !== undefined &&
        identifier.value.length > 0
    ) {
        return identifier.value
    }
    return undefined
}

export const organizationNumberFromIdentifiers = (identifiers: IIdentifier[]): string | undefined => {
    for(const identifier of identifiers) {
        const orgNum = organizationNumberFromIdentifier(identifier)
        if (orgNum !== undefined) {
            return orgNum
        }
    }
    return undefined
}

// According to https://www.hl7.org/fhir/R4/practitioner-definitions.html#Practitioner.active, and
// https://www.hl7.org/fhir/R4/practitionerrole-definitions.html#PractitionerRole.active, the
// Practitioner and PractitionerRole "is generally assumed to be active if no value is provided for the active element":
export const trueIfUndefined = (active: boolean | undefined): boolean => active === undefined ? true: active

export const resolvePractitionerFromIPractitionerRole = (practitionerRole: IPractitionerRole): PartialPractitioner => {
    const identifierValue = practitionerRole.practitioner?.identifier?.value
    const practitioner = iPractitionerFromListing(practitionerRole.contained || [])
    return {
        epjId: identifierValue,
        hprNumber: hprNumberFromIdentifiers(practitionerRole.identifier || []),
        name: officialHumanNameResolver(practitioner?.name),
        activeSystemUser: trueIfUndefined(practitionerRole.active)
    }
}

export const resolvePractitionerFromIPractitioner = (iPractitioner: IPractitioner): PartialPractitioner => {
    return {
        epjId: iPractitioner.id,
        hprNumber: hprNumberFromIdentifiers(iPractitioner.identifier || []),
        name: officialHumanNameResolver(iPractitioner.name),
        // According to https://www.hl7.org/fhir/R4/practitioner-definitions.html#Practitioner.active, the
        // practitioner "is generally assumed to be active if no value is provided for the active element":
        activeSystemUser: trueIfUndefined(iPractitioner.active),
    }
}
