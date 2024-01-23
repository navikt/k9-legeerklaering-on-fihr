import { ObjectSchema, Schema } from "yup";
import DatePeriod from "@/models/DatePeriod";
import * as yup from "yup";
import { Diagnosekode } from "@navikt/diagnosekoder";
import { tekst } from "@/utils/tekster";
import { LegeerklaeringDokumentReferanse } from "@/models/LegeerklaeringDokumentReferanse";
import { legeerklaeringDokumentReferanseSchema } from "@/models/yup/LegeerklaeringDokumentReferanseSchema";
import { DipsDepartmentReference } from "@/models/DipsDepartmentReference";
import { dipsDepartmentReferenceSchema } from "@/models/yup/DipsDepartmentReferenceSchema";
import LegeerklaeringDokument from "@/models/LegeerklaeringDokument";

const tilsynsPeriodValidation: ObjectSchema<DatePeriod> = yup.object({
    start: yup.date().required("Fra dato er påkrevd"),
    end: yup.date().required("Til dato er påkrevd"),
}).test({
    name: 'datePeriodStartBeforeEnd',
    skipAbsent: true,
    message: `Periode start må være før slutt`,
    test: (period) =>
        period.start === undefined ||
        period.end === undefined ||
        period.start.getTime() <= period.end.getTime()
})

const innleggelsesPeriodValidation: ObjectSchema<DatePeriod> = yup.object({
    start: yup.date().optional(),
    end: yup.date().optional(),
}).test({
    name: 'datePeriodStartBeforeEnd',
    skipAbsent: true,
    message: `Periode start må være før slutt`,
    test: (period) =>
        period.start === undefined ||
        period.end === undefined ||
        period.start.getTime() <= period.end.getTime()
})

const hoveddiagnoseValidator: ObjectSchema<Diagnosekode> = yup.object({
    code: yup.string().required(tekst("legeerklaering.diagnose.hoveddiagnose.paakrevd")),
    text: yup.string().required(tekst("legeerklaering.diagnose.hoveddiagnose.paakrevd"))
})

const bidiagnosekodeValidator: ObjectSchema<Diagnosekode> = yup.object({
    code: yup.string().required("Bidiagnosekode er påkrevd"),
    text: yup.string().required("Bidiagnosetekst er påkrevd"),
})

const dokumentReferanseValidator: Schema<LegeerklaeringDokumentReferanse> = legeerklaeringDokumentReferanseSchema().required();
const dokumentAnsvarligValidator: Schema<DipsDepartmentReference> = dipsDepartmentReferenceSchema().required()

export const legeerklaeringDokumentSchema: ObjectSchema<LegeerklaeringDokument> = yup.object({
    dokumentReferanse: dokumentReferanseValidator,
    dokumentAnsvarlig: dokumentAnsvarligValidator,
    barn: yup.object({
        name: yup.string().trim()
            .required(tekst("legeerklaering.om-barnet.navn.paakrevd"))
            .min(3, ({min}) => `Minimum ${min} tegn må skrives inn`)
            .max(150, ({max}) => `Maks ${max} tegn tillatt`),
        fnr: yup.string().trim()
            .required(tekst("legeerklaering.om-barnet.ident.paakrevd"))
            .min(11, ({min}) => `Må vere minimum ${min} tegn`)
            .max(40, ({max, value}) => `Maks ${max} tegn tillatt (${value.length})`),
        ehrId: yup.string().required("ehrId må eksistere"),
        birthDate: yup.date().required(tekst("legeerklaering.om-barnet.foedselsdato.paakrevd")),
    }),
    lege: yup.object({
        ehrId: yup.string().required("legens epj systemid er påkrevd"),
        hprNumber: yup.string().required(tekst("legeerklaering.om-legen.hpr-nummer.paakrevd")),
        name: yup.string().required(tekst("legeerklaering.om-legen.navn.paakrevd")),
        activeSystemUser: yup.boolean().required("legens systemstatus (aktiv) er påkrevd"),
        practitionerRoleId: yup.string().required("Legens practitionerRoleId er påkrevd"),
        departmentReference: dipsDepartmentReferenceSchema().required(),
    }),
    sykehus: yup.object({
        ehrId: yup.string().optional(),
        organizationNumber: yup.string().optional(),
        name: yup.string().trim().required(tekst("legeerklaering.om-sykehuset.navn.paakrevd")),
        phoneNumber: yup.string().trim().required(tekst("legeerklaering.om-sykehuset.tlf.paakrevd")),
        address: yup.object({
            line1: yup.string().trim().required(tekst("legeerklaering.om-sykehuset.gateadresse.paakrevd")),
            line2: yup.string().trim().optional(),
            postalCode: yup.string()
                .required(tekst("legeerklaering.om-sykehuset.postnummer.paakrevd"))
                .min(4, ({min}) => `Må være minimum ${min} siffer`)
                .max(5, ({max}) => `Kan være maks ${max} siffer`)
                .matches(/^[0-9]{4,5}$/, oops => `Bare tall tillat ${oops.label}`),
            city: yup.string().required(tekst("legeerklaering.om-sykehuset.poststed.paakrevd")),
        }).required()
    }),
    hoveddiagnose: hoveddiagnoseValidator,
    bidiagnoser: yup.array().of(bidiagnosekodeValidator).default([]),
    vurderingAvBarnet: yup.string().trim().required(tekst("legeerklaering.legens-vurdering.barn.paakrevd")),
    vurderingAvOmsorgspersoner: yup.string().trim().optional().default(""), // Set to blank string for type compatibility
    tilsynPeriode: tilsynsPeriodValidation,
    innleggelsesPerioder: yup.array().of(innleggelsesPeriodValidation).required(),
})
