import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Modal, ReadMore, Textarea, TextField, useDatepicker} from '@navikt/ds-react';
import {Controller, SubmitErrorHandler, useForm} from 'react-hook-form';
import Section from '@/app/components/Section';
import {tekst} from '@/utils/tekster';
import HoveddiagnoseSelect from "@/app/components/diagnosekoder/HoveddiagnoseSelect";
import BidiagnoseSelect from "@/app/components/diagnosekoder/BidiagnoseSelect";
import SummaryModal from "@/app/components/legeerklaering/SummaryModal";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient";
import Hospital from "@/models/Hospital";
import * as yup from "yup";
import {ObjectSchema} from "yup";
import {Diagnosekode} from "@/app/api/diagnosekoder/Diagnosekode";
import {yupResolver} from "@hookform/resolvers/yup";
import LegeerklaeringData from "@/app/components/legeerklaering/LegeerklaeringData";
import DatePeriod from "@/models/DatePeriod";
import MultiDatePeriodInput from "@/app/components/multidateperiod/MultiDatePeriodInput";

export interface EhrInfoLegeerklaeringForm {
    readonly doctor: Doctor | undefined;
    readonly patient: Patient | undefined;
    readonly hospital: Hospital | undefined;
}

const diagnosekodeValidation: ObjectSchema<Diagnosekode> = yup.object({
    code: yup.string().required().min(4).max(10),
    text: yup.string().required()
})

const datePeriodValidation: ObjectSchema<DatePeriod> = yup.object({
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

const schema: ObjectSchema<LegeerklaeringData> = yup.object({
    barn: yup.object({
        name: yup.string().trim()
            .required(tekst("legeerklaering.om-barnet.navn.paakrevd"))
            .min(3, ({min}) => `Minimum ${min} tegn må skrives inn`)
            .max(150, ({max}) => `Maks ${max} tegn tillatt`),
        identifier: yup.string().trim()
            .required(tekst("legeerklaering.om-barnet.ident.paakrevd"))
            .min(11, ({min}) => `Må vere minimum ${min} tegn`)
            .max(40, ({max, value}) => `Maks ${max} tegn tillatt (${value.length})`),
        birthDate: yup.date().required(tekst("legeerklaering.om-barnet.foedselsdato.paakrevd"))
    }),
    lege: yup.object({
        hprNumber: yup.string().required(tekst("legeerklaering.om-legen.hpr-nummer.paakrevd")),
        name: yup.string().required(tekst("legeerklaering.om-legen.navn.paakrevd"))
    }),
    sykehus: yup.object({
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
    hoveddiagnose: diagnosekodeValidation.optional().default(undefined),
    bidiagnoser: yup.array().of(diagnosekodeValidation).required(),
    legensVurdering: yup.string().trim().required(tekst("legeerklaering.legens-vurdering.paakrevd")),
    tilsynPerioder: yup.array().of(datePeriodValidation).min(1, ({min}) => `Minimum ${min} periode må spesifiseres`).required(),
    innleggelsesPerioder: yup.array().of(datePeriodValidation).required()
})

export default function LegeerklaeringForm(ehrInfo: EhrInfoLegeerklaeringForm) {
    const [submittedData, setSubmittedData] = useState<LegeerklaeringData | null>(null);

    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: {errors, defaultValues},
    } = useForm<LegeerklaeringData>({
        resolver: yupResolver(schema),
        defaultValues: {
            barn: {
                name: ehrInfo.patient?.name,
                identifier: ehrInfo.patient?.identifier,
                birthDate: ehrInfo.patient?.birthDate,
            },
            lege: {
                hprNumber: ehrInfo.doctor?.hprNumber,
                name: ehrInfo.doctor?.name,
            },
            sykehus: {
                name: ehrInfo.hospital?.name,
                phoneNumber: ehrInfo.hospital?.phoneNumber,
                address: {
                    line1: ehrInfo.hospital?.address?.line1,
                    line2: ehrInfo.hospital?.address?.line2,
                    postalCode: ehrInfo.hospital?.address?.postalCode,
                    city: ehrInfo.hospital?.address?.city,
                }
            },
            hoveddiagnose: undefined,
            bidiagnoser: [],
            legensVurdering: undefined,
            tilsynPerioder: [{
                start: undefined,
                end: undefined,
            }],
            innleggelsesPerioder: [{
                start: undefined,
                end: undefined,
            }]
        }
    })

    useEffect(() => {
        Modal.setAppElement(document.body);
    }, []);

    const {
        datepickerProps: barnFoedselDatepickerProps,
        inputProps: barnFoedselsInputProps
    } = useDatepicker({
        defaultSelected: ehrInfo.patient?.birthDate,
        onDateChange: (dato) => {
            setValue('barn.birthDate', dato, {shouldDirty: true, shouldTouch: true, shouldValidate: true})
        }
    });

    const onSubmit = (data: LegeerklaeringData) => {
        setSubmittedData(data)
        console.log("Form data", data);
    };

    const onError: SubmitErrorHandler<LegeerklaeringData> = errors => {
        console.warn("form validation errors", errors)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Section
                title={tekst("legeerklaering.om-barnet.tittel")}
                helpText={tekst("legeerklaering.om-barnet.hjelpetekst")}
            >
                <TextField
                    label={tekst("legeerklaering.felles.navn.label")}
                    defaultValue={defaultValues?.barn?.name}
                    {...register("barn.name", {required: true})}
                    error={errors.barn?.name?.message}
                    className="w-1/2 mb-4"
                />
                <div className="mb-4">
                    <TextField
                        label={tekst("legeerklaering.om-barnet.ident.label")}
                        defaultValue={defaultValues?.barn?.identifier}
                        {...register("barn.identifier", {required: true})}
                        error={errors.barn?.identifier?.message}
                        className="w-1/2 mb-4"
                    />
                    <DatePicker{...barnFoedselDatepickerProps}>
                        <DatePicker.Input
                            label={tekst("legeerklaering.om-barnet.foedselsdato.label")}
                            {...barnFoedselsInputProps}
                            error={errors.barn?.birthDate?.message}
                        />
                    </DatePicker>
                </div>
            </Section>

            <Section
                title={tekst("legeerklaering.legens-vurdering.tittel")}
                helpText={tekst("legeerklaering.legens-vurdering.hjelpetekst")}
            >
                <ReadMore
                    size='small'
                    header={tekst("legeerklaering.legens-vurdering.les-mer.tittel")}
                    className="mb-8">
                    {tekst("legeerklaering.legens-vurdering.les-mer.tekst")}
                </ReadMore>
                <Textarea
                    label={tekst("legeerklaering.legens-vurdering.label")}
                    {...register("legensVurdering", {required: true})}
                    error={errors.legensVurdering?.message }
                    minRows={10}
                />
            </Section>

            <Section
                title={tekst("legeerklaering.diagnose.tittel")}
                helpText={tekst("legeerklaering.diagnose.hjelpetekst")}
            >
                <Controller
                    control={control}
                    name="hoveddiagnose"
                    render={({field: {onChange, value}}) => (
                        <HoveddiagnoseSelect className="mb-4" value={value} onChange={onChange} error={errors.hoveddiagnose?.message}  />
                    )}
                />

                <Controller
                    control={control}
                    name="bidiagnoser"
                    render={({field: {onChange, value}}) => (
                        <BidiagnoseSelect className="mb-4" value={value} onChange={onChange} error={errors.bidiagnoser?.message} />
                    )}
                />
            </Section>

            <Section
                title={tekst("legeerklaering.tilsyn-varighet.tittel")}
                helpText={tekst("legeerklaering.tilsyn-varighet.hjelpetekst")}
            >
                <Controller
                    control={control}
                    name="tilsynPerioder"
                    render={({field: {onChange, value}}) => (
                        <MultiDatePeriodInput
                            value={value}
                            onChange={onChange}
                            error={errors.tilsynPerioder?.message}
                            valueErrors={errors.tilsynPerioder?.map?.(e => e?.start?.message || e?.end?.message || e?.message)} // maps validation errors to the correct input row in MultiDatePeriodInput
                        />
                    )}
                />
            </Section>

            <Section title={tekst("legeerklaering.innleggelse-varighet.tittel")}>
                <Controller
                    control={control}
                    name="innleggelsesPerioder"
                    render={({field: {onChange, value}}) => (
                        <MultiDatePeriodInput
                            value={value}
                            onChange={onChange}
                            error={errors.innleggelsesPerioder?.message}
                            valueErrors={errors.innleggelsesPerioder?.map?.(e => e?.start?.message || e?.end?.message || e?.message)}
                        />
                    )}
                />
            </Section>

            <Section title={tekst("legeerklaering.om-legen.tittel")}>
                <TextField
                    label={tekst("legeerklaering.felles.navn.label")}
                    defaultValue={defaultValues?.lege?.name}
                    {...register("lege.name", {required: true})}
                    error={errors.lege?.name?.message}
                    className="mb-4 w-1/2"
                />
                <TextField
                    label={tekst("legeerklaering.om-legen.hpr-nummer.label")}
                    defaultValue={defaultValues?.lege?.hprNumber}
                    {...register("lege.hprNumber", {required: true})}
                    error={errors.lege?.hprNumber?.message}
                    className="w-1/2"
                />
            </Section>

            <Section title="Opplysninger om sykehuset">
                <div className="flex space-x-4 mb-4">
                    <TextField
                        label={tekst("legeerklaering.felles.navn.label")}
                        {...register("sykehus.name", {required: true})}
                        error={errors.sykehus?.name?.message}
                        className="w-3/4"
                    />
                    <TextField
                        label={tekst("legeerklaering.om-sykehuset.tlf.label")}
                        type="tel"
                        {...register("sykehus.phoneNumber", {required: true})}
                        error={errors.sykehus?.phoneNumber?.message}
                        className="w-1/4"
                    /></div>
                <TextField
                    label={tekst("legeerklaering.om-sykehuset.gateadresse.label")}
                    defaultValue={defaultValues?.sykehus?.address?.line1}
                    {...register("sykehus.address.line1", {required: true})}
                    error={errors.sykehus?.address?.line1?.message}
                    className="mb-4 w-3/4"
                />
                <TextField
                    label={tekst("legeerklaering.om-sykehuset.gateadresse.label")}
                    hideLabel={true}
                    defaultValue={defaultValues?.sykehus?.address?.line2}
                    {...register("sykehus.address.line2")}
                    error={errors.sykehus?.address?.line2?.message}
                    className="mb-4 w-3/4"
                />
                <div className="flex mb-4 space-x-4">
                    <TextField
                        label={tekst("legeerklaering.om-sykehuset.postnummer.label")}
                        defaultValue={defaultValues?.sykehus?.address?.postalCode}
                        type="number"
                        {...register("sykehus.address.postalCode", {required: true})}
                        error={errors.sykehus?.address?.postalCode?.message}
                        className="w-1/4"
                    />
                    <TextField
                        label={tekst("legeerklaering.om-sykehuset.poststed.label")}
                        defaultValue={defaultValues?.sykehus?.address?.city}
                        {...register("sykehus.address.city", {required: true})}
                        error={errors.sykehus?.address?.city?.message}
                        className="w-3/4"
                    />
                </div>
            </Section>

            <div className="ml-4 mt-4 mb-16"><Button type="submit">Registrer</Button></div>

            {/*(Temporary) summary modal displayed when user submits form*/}
            <SummaryModal show={submittedData !== null} onClose={() => setSubmittedData(null)} data={submittedData} />
        </form>
    )
}
