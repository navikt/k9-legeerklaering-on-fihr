import {
    dateTimePeriodResolver,
    dateTimeResolver, dnrFromIdentifier, dnrFromIdentifiers, fnrFromIdentifier, fnrFromIdentifiers,
    hprNumberFromIdentifiers,
    isDateWithinPeriod,
    organizationNumberFromIdentifier,
    phoneContactResolver,
    postalAddressResolver, resolveRelatedPersonFromIRelatedPerson
} from "@/integrations/fhir/resolvers";
import {
    ContactPointSystemKind,
    IContactPoint,
    IdentifierUseKind,
    IIdentifier,
    IPeriod
} from "@ahryman40k/ts-fhir-types/lib/R4";
import DatePeriod, { datePeriod } from "@/models/DatePeriod";
import Address from "@/models/Address";
import { HprNumber } from "@/models/HprNumber";
import RelatedPerson from "@/models/RelatedPerson";
import { R4 } from "@ahryman40k/ts-fhir-types";
import { validateOrThrow } from "@/integrations/fhir/fhirValidator";

describe(`fhir dateTime resolver`, () => {
    const validTestcases = {
        "2023-04-01T01:02:03+02:00": new Date("2023-04-01T01:02:03+02:00"),
        "2023-04-01": new Date("2023-04-01T00:00:00Z"),
        "2023-04": new Date("2023-04-01T00:00:00Z"),
        "2023": new Date("2023-01-01T00:00:00Z"),
    }

    test(`valid inputs should resolve to expected Date`, () => {
        for(const [input, expected] of Object.entries(validTestcases)) {
            expect(dateTimeResolver(input)).toEqual(expected)
        }
    })
})

describe('fhir dateTimePeriodResolver', () => {
    type TestCase = {
        input: IPeriod,
        expected: DatePeriod,
    }
    const inputIPeriod = (start?: string, end?: string): IPeriod => ({start, end})
    const validTestcases: TestCase[] = [
        {
            input: inputIPeriod("2023-04-01T12:23:00+02:00", "2023-05-12"),
            expected: {start: new Date("2023-04-01T12:23:00+02:00"), end: new Date("2023-05-12")}
        },
        {
            input: inputIPeriod("2023-04-01T12:23:00+02:00", undefined),
            expected: {start: new Date("2023-04-01T12:23:00+02:00")}
        },
    ]
    test(`valid inputs should resolve to expected period`, () => {
        for(const testCase of validTestcases) {
            expect(dateTimePeriodResolver(testCase.input)).toEqual(testCase.expected)
        }
    })
});

describe('fhir isDateWithinPeriod', () => {
    test('with both start and end specified should work', () => {
        const period = datePeriod(new Date("2021-04-02"), new Date("2021-04-05"))
        const before = new Date("2021-04-01")
        const within = new Date("2021-04-03")
        const after = new Date("2021-04-06")
        expect(isDateWithinPeriod(before, period)).toBe(false)
        expect(isDateWithinPeriod(within, period)).toBe(true)
        expect(isDateWithinPeriod(after, period)).toBe(false)
        expect(isDateWithinPeriod(period.start!, period)).toBe(true)
        expect(isDateWithinPeriod(period.end!, period)).toBe(true)
    })
    test('without end should work', () => {
        const period = datePeriod(new Date("2021-04-02"), undefined)
        const before = new Date("2021-04-01")
        const within = new Date("2021-04-03")
        expect(isDateWithinPeriod(before, period)).toBe(false)
        expect(isDateWithinPeriod(within, period)).toBe(true)
        expect(isDateWithinPeriod(period.start!, period)).toBe(true)
    })
    test('with undefined start always results in undefined', () => {
        const period = datePeriod(undefined, new Date())
        const before = new Date("2021-04-01")
        expect(isDateWithinPeriod(before, period)).toBeUndefined()
        expect(isDateWithinPeriod(period.end!, period)).toBeUndefined()
    })
})

describe('fhir postalAddressResolver', () => {
    const input1 = [
        {
            "line": [
                "235 NORTH PEARL STREET"
            ],
            "city": "BROCKTON",
            "state": "MA",
            "postalCode": "02301",
            "country": "US"
        }
    ]
    const expect1: Address = {
        line1: input1[0].line[0],
        line2: undefined,
        postalCode: input1[0].postalCode,
        city: input1[0].city
    }
    test('with one address without any filtering info, return it', () => {
        expect(postalAddressResolver(input1)).toEqual(expect1)
    })
    // XXX Add more testcases as real world data is found
})

describe('fhir phoneContactResolver', () => {
    const input1: IContactPoint[] = [
        {
            "system": ContactPointSystemKind._phone,
            "value": "5084273000"
        }
    ];
    const expected1 = input1[0].value
    test('with one phone without any filtering info, return it', () => {
        expect(phoneContactResolver(input1)).toEqual(expected1)
    })
    // XXX Add more testcases as real world data is found
})

describe('fhir hprNumberFromIdentifiers', () => {
    test('a identifiers array with empty hpr number, but others populated', () => {
        const identifiers: IIdentifier[] = [
            {
                "use": IdentifierUseKind._official,
                "system": "urn:oid:1.3.6.1.4.1.9038.51",
                "value": "ASC"
            },
            {
                "use": IdentifierUseKind._official,
                "system": "urn:oid:1.3.6.1.4.1.9038.51.1",
                "value": "1000755"
            },
            {
                "use": IdentifierUseKind._official,
                "system": "urn:oid:2.16.578.1.12.4.1.4.4",
                "value": ""
            }
        ]
        expect(hprNumberFromIdentifiers(identifiers)).toBeUndefined()
    })
    test('a identifiers array with no hpr number element, but others populated', () => {
        const identifiers: IIdentifier[] = [
            {
                "use": IdentifierUseKind._official,
                "system": "urn:oid:1.3.6.1.4.1.9038.51",
                "value": "ASC"
            },
            {
                "use": IdentifierUseKind._official,
                "system": "urn:oid:1.3.6.1.4.1.9038.51.1",
                "value": "1000755"
            }
        ]
        expect(hprNumberFromIdentifiers(identifiers)).toBeUndefined()
    })
    test('a identifiers array with hpr number element and others', () => {
        const hprNumber = "001234567" satisfies HprNumber
        const identifiers: IIdentifier[] = [
            {
                "use": IdentifierUseKind._official,
                "system": "urn:oid:1.3.6.1.4.1.9038.51",
                "value": "ASC"
            },
            {
                "use": IdentifierUseKind._official,
                "system": "urn:oid:1.3.6.1.4.1.9038.51.1",
                "value": "1000755"
            },
            {
                "use": IdentifierUseKind._official,
                "system": "urn:oid:2.16.578.1.12.4.1.4.4",
                "value": hprNumber
            }
        ]
        expect(hprNumberFromIdentifiers(identifiers)).toEqual(hprNumber)
    })
    test('resolving organization number from IIdentifier', () => {
        const orgNum = "970948139"
        const id: IIdentifier = {
            "use": IdentifierUseKind._official,
            "system": "urn:oid:2.16.578.1.12.4.1.4.101",
            "value": orgNum
        }
        expect(organizationNumberFromIdentifier(id)).toEqual(orgNum)
    })
});

const fnrInput = "12082190455"
const fnrIdentifierInput = validateOrThrow(R4.RTTI_Identifier.decode({
    "use": "official",
    "system": "urn:oid:2.16.578.1.12.4.1.4.1",
    "value": fnrInput
}))

const dnrInput = "43056078023"
const dnrIdentifierInput = validateOrThrow(R4.RTTI_Identifier.decode({
    "use": "official",
    "system": "urn:oid:2.16.578.1.12.4.1.4.2",
    "value": dnrInput
}))

describe("fhir resolve fnr from identifier", () => {
    test("with valid single input", () => {
        const expected = "12082190455"
        expect(fnrFromIdentifier(fnrIdentifierInput)).toEqual(expected)
    })
})

describe("fhir resolve dnr from identifier", () => {
    test("with valid single input", () => {
        const expected = "43056078023"
        expect(dnrFromIdentifier(dnrIdentifierInput)).toEqual(expected)
    })
})

describe("fhir resolve fnr or dnr from identifiers", () => {
    test("both dnr and fnr should always return fnr, regardless for order", () => {
        let inp = [dnrIdentifierInput, fnrIdentifierInput]
        expect(fnrFromIdentifiers(inp) || dnrFromIdentifiers(inp)).toEqual(fnrInput)
        inp = [fnrIdentifierInput, dnrIdentifierInput]
        expect(fnrFromIdentifiers(inp) || dnrFromIdentifiers(inp)).toEqual(fnrInput)
    })
})

describe("fhir RelatedPerson from IRelatedPerson", () => {
    test("some valid input without fødselsnr should work", () => {
        const inp = validateOrThrow(R4.RTTI_RelatedPerson.decode({
            "resourceType": "RelatedPerson",
            "id": "aoz2018889cdp2015831",
            "meta": {
                "profile": [
                    "DIPSRelatedPerson",
                    "NoBasisRelatedPerson"
                ]
            },
            "extension": [
                {
                    "url": "http://dips.no/fhir/StructureDefinition/R4/DIPSRelatedPersonParentalResponsibility",
                    "valueBoolean": true
                }
            ],
            "identifier": [
                {
                    "use": "official",
                    "system": "http://dips.no/fhir/namingsystem/dips-relativeid",
                    "value": "aoz2018889cdp2015831"
                }
            ],
            "active": true,
            "patient": {
                "reference": "Patient/cdp2015831",
                "identifier": {
                    "use": "official",
                    "system": "http://dips.no/fhir/namingsystem/dips-patientid",
                    "value": "2015831"
                }
            },
            "relationship": [
                {
                    "coding": [
                        {
                            "system": "urn:oid:1.3.6.1.4.1.9038.52.4353",
                            "code": "1",
                            "display": "Forelder/foresatt"
                        }
                    ]
                },
                {
                    "coding": [
                        {
                            "system": "urn:oid:1.3.6.1.4.1.9038.52.1045",
                            "code": "104500",
                            "display": "Hovedpårørende"
                        }
                    ]
                },
                {
                    "coding": [
                        {
                            "system": "urn:oid:1.3.6.1.4.1.9038.52.3210",
                            "code": "1",
                            "display": "Biologisk mor"
                        }
                    ]
                },
                {
                    "coding": [
                        {
                            "system": "http://hl7.org/fhir/ValueSet/relatedperson-relationshiptype",
                            "code": "MTH",
                            "display": "mother"
                        }
                    ]
                }
            ],
            "name": [
                {
                    "text": "Lastname1, Firstname1",
                    "family": "Lastname1",
                    "given": [
                        "Firstname1"
                    ]
                }
            ],
            "gender": "female",
            "birthDate": "1990-03-02",
            "address": [
                {
                    "extension": [
                        {
                            "url": "http://hl7.no/fhir/StructureDefinition/no-basis-propertyinformation",
                            "valueCoding": {
                                "system": "urn:oid:1.3.6.1.4.1.9038.52.5",
                                "code": "1804",
                                "display": "Bodø"
                            }
                        }
                    ],
                    "use": "home",
                    "line": [
                        "Address 1234"
                    ],
                    "city": "Bodø",
                    "district": "NORDLAND FYLKESKOMMUNE",
                    "_district": {
                        "extension": [
                            {
                                "url": "http://dips.no/fhir/StructureDefinition/R4/MunicipalityCode",
                                "valueCoding": {
                                    "system": "urn:oid:1.3.6.1.4.1.9038.52.5",
                                    "code": "1804",
                                    "display": "Bodø"
                                }
                            }
                        ]
                    },
                    "state": "18",
                    "postalCode": "8073",
                    "country": "Norway"
                }
            ]
        }))
        const expected: RelatedPerson = {
            ehrId: "aoz2018889cdp2015831",
            name: "Lastname1, Firstname1",
            fnr: null
        }
        const result = resolveRelatedPersonFromIRelatedPerson(inp)
        expect(result).toEqual(expected)
    })

    test("some valid input with fødselsnr should work", () => {
        const inp = validateOrThrow(R4.RTTI_RelatedPerson.decode({
                "resourceType": "RelatedPerson",
                "id": "aoz2016788cdp2015431",
                "meta": {
                    "profile": [
                        "DIPSRelatedPerson",
                        "NoBasisRelatedPerson"
                    ]
                },
                "extension": [
                    {
                        "url": "http://dips.no/fhir/StructureDefinition/R4/DIPSRelatedPersonKinship",
                        "valueString": "Søster"
                    },
                    {
                        "url": "http://dips.no/fhir/StructureDefinition/R4/DIPSRelatedPersonParentalResponsibility",
                        "valueBoolean": false
                    }
                ],
                "identifier": [
                    {
                        "use": "official",
                        "system": "urn:oid:2.16.578.1.12.4.1.4.1",
                        "value": "12082190455"
                    },
                    {
                        "use": "official",
                        "system": "http://dips.no/fhir/namingsystem/dips-relativeid",
                        "value": "aoz2016788cdp2015831"
                    }
                ],
                "active": true,
                "patient": {
                    "reference": "Patient/cdp2015831",
                    "identifier": {
                        "use": "official",
                        "system": "http://dips.no/fhir/namingsystem/dips-patientid",
                        "value": "2015831"
                    }
                },
                "relationship": [
                    {
                        "coding": [
                            {
                                "system": "urn:oid:1.3.6.1.4.1.9038.52.1045",
                                "code": "263061",
                                "display": "Barn som pårørende"
                            }
                        ]
                    }
                ],
                "name": [
                    {
                        "text": "Lastname2, Firstname2",
                        "family": "Lastname2",
                        "given": [
                            "Firstname2"
                        ]
                    }
                ],
                "gender": "female",
                "birthDate": "2021-05-22",
                "address": [
                    {
                        "extension": [
                            {
                                "url": "http://hl7.no/fhir/StructureDefinition/no-basis-propertyinformation",
                                "valueCoding": {
                                    "system": "urn:oid:1.3.6.1.4.1.9038.52.5",
                                    "code": "0301",
                                    "display": "Oslo"
                                }
                            }
                        ],
                        "use": "home",
                        "line": [
                            "771 Schanche Vei Leilighet 39"
                        ],
                        "city": "Oslo",
                        "district": "OSLO FYLKESKOMMUNE",
                        "_district": {
                            "extension": [
                                {
                                    "url": "http://dips.no/fhir/StructureDefinition/R4/MunicipalityCode",
                                    "valueCoding": {
                                        "system": "urn:oid:1.3.6.1.4.1.9038.52.5",
                                        "code": "0301",
                                        "display": "Oslo"
                                    }
                                }
                            ]
                        },
                        "state": "03",
                        "postalCode": "0276",
                        "country": "Norway"
                    }
                ]
        }))
        const expected: RelatedPerson = {
            ehrId: "aoz2016788cdp2015431",
            name: "Lastname2, Firstname2",
            fnr: "12082190455"
        }

        expect(resolveRelatedPersonFromIRelatedPerson(inp)).toEqual(expected)
    })
})