import React, {useEffect, useState} from 'react';
import {
    Button,
    DatePicker,
    Modal,
    ReadMore,
    Textarea,
    TextField,
    useDatepicker,
    useRangeDatepicker
} from '@navikt/ds-react';
import {Controller, useForm} from 'react-hook-form';
import Section from '@/app/components/Section';
import {tekst} from '@/utils/tekster';
import HoveddiagnoseSelect from "@/app/components/diagnosekoder/HoveddiagnoseSelect";
import BidiagnoseSelect from "@/app/components/diagnosekoder/BidiagnoseSelect";
import {LegeerklaeringFormData} from "@/models/legeerklæring";
import SummaryModal from "@/app/components/legeerklaering/SummaryModal";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient";
import Hospital from "@/models/Hospital";
import * as yup from "yup";
import {ObjectSchema} from "yup";
import {Diagnosekode} from "@/app/api/diagnosekoder/Diagnosekode";
import {yupResolver} from "@hookform/resolvers/yup";

export interface EhrInfoLegeerklaeringForm {
    readonly doctor: Doctor | undefined;
    readonly patient: Patient | undefined;
    readonly hospital: Hospital | undefined;
}

const diagnosekodeValidation: ObjectSchema<Diagnosekode> = yup.object({
    code: yup.string().required().min(4).max(10),
    text: yup.string().required()
})

const schema: ObjectSchema<LegeerklaeringFormData> = yup.object({
    barn: yup.object({
        navn: yup.string().trim()
            .required(tekst("legeerklaering.om-barnet.navn.paakrevd"))
            .min(3, ({min}) => `Minimum ${min} tegn må skrives inn`)
            .max(150, ({max}) => `Maks ${max} tegn tillatt`),
        ident: yup.string().trim()
            .required(tekst("legeerklaering.om-barnet.ident.paakrevd"))
            .min(11, ({min}) => `Må vere minimum ${min} tegn`)
            .max(40, ({max, value}) => `Maks ${max} tegn tillatt (${value.length})`),
        foedselsdato: yup.date().required(tekst("legeerklaering.om-barnet.foedselsdato.paakrevd"))
    }),
    lege: yup.object({
        hrpNummer: yup.string().required(tekst("legeerklaering.om-legen.hrp-nummer.paakrevd")),
        navn: yup.string().required(tekst("legeerklaering.om-legen.navn.paakrevd"))
    }),
    sykehus: yup.object({
        navn: yup.string().trim().required(tekst("legeerklaering.om-sykehuset.navn.paakrevd")),
        telefon: yup.string().trim().required(tekst("legeerklaering.om-sykehuset.tlf.paakrevd")),
        adresse: yup.object({
            gate: yup.string().trim().required(tekst("legeerklaering.om-sykehuset.gateadresse.paakrevd")),
            postnummer: yup.string().label("Postnr")
                .required(tekst("legeerklaering.om-sykehuset.postnummer.paakrevd"))
                .min(4, ({min}) => `Må være minimum ${min} siffer`)
                .max(5, ({max}) => `Kan være maks ${max} siffer`)
                .matches(/^[0-9]{4,5}$/, oops => `Bare tall tillat ${oops.label}`),
            poststed: yup.string().required(tekst("legeerklaering.om-sykehuset.poststed.paakrevd")),
        })
    }),
    hoveddiagnose: diagnosekodeValidation.optional().default(undefined),
    bidiagnoser: yup.array().of(diagnosekodeValidation).required(),
    legensVurdering: yup.string().trim().required(tekst("legeerklaering.legens-vurdering.paakrevd")),
    tilsynPeriode: yup.object({
        fra: yup.date().required(tekst("legeerklaering.tilsyn-varighet.fom.paakrevd")),
        til: yup.date().required(tekst("legeerklaering.tilsyn-varighet.tom.paakrevd")),
    }),
    innleggelsesPeriode: yup.object({
        fra: yup.date().required(tekst("legeerklaering.innleggelse-varighet.fom.paakrevd")),
        til: yup.date().required(tekst("legeerklaering.innleggelse-varighet.tom.paakrevd")),
    })
})

export default function LegeerklaeringForm(ehrInfo: EhrInfoLegeerklaeringForm) {
    const [submittedData, setSubmittedData] = useState<LegeerklaeringFormData | null>(null);

    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: {errors, defaultValues},
    } = useForm<LegeerklaeringFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            barn: {
                navn: ehrInfo.patient?.name ?? "",
                ident: ehrInfo.patient?.identifier ?? "",
                foedselsdato: ehrInfo.patient?.birthDate,
            },
            lege: {
                hrpNummer: ehrInfo.doctor?.id ?? "",
                navn: ehrInfo.doctor?.name ?? "",
            },
            sykehus: {
                navn: ehrInfo.hospital?.name ?? "",
                telefon: ehrInfo.hospital?.phoneNumber ?? "",
                adresse: {
                    gate: [ehrInfo.hospital?.address?.line1 ?? "", ehrInfo.hospital?.address?.line2 ?? ""].filter(l => l.trim().length > 0).join(", "),
                    postnummer: ehrInfo.hospital?.address?.postalCode ?? "",
                    poststed: ehrInfo.hospital?.address?.city ?? "",
                }
            },
            hoveddiagnose: undefined,
            bidiagnoser: [],
            legensVurdering: "",
            tilsynPeriode: {
                fra: new Date(),
                til: new Date(),
            },
            innleggelsesPeriode: {
                fra: new Date(),
                til: new Date(),
            }
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
            setValue('barn.foedselsdato', dato, {shouldDirty: true, shouldTouch: true, shouldValidate: true})
        }
    });

    const {
        datepickerProps: tilsynDatepickerProps,
        fromInputProps: tilsynFraInputProps,
        toInputProps: tilsynTilInputProps,
    } = useRangeDatepicker({
        today: new Date(),
        onRangeChange: (dato) => {
            if (dato?.from !== undefined) setValue('tilsynPeriode.fra', dato?.from, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            })
            if (dato?.to !== undefined) setValue('tilsynPeriode.til', dato?.to, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            })
        }
    });

    const {
        datepickerProps: innleggelseDatepickerProps,
        fromInputProps: innleggelseFraInputProps,
        toInputProps: innleggelseTilInputProps,
    } = useRangeDatepicker({
        today: new Date(),
        onRangeChange: (dato) => {
            if (dato?.from !== undefined) setValue('innleggelsesPeriode.fra', dato?.from!!, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            })
            if (dato?.to !== undefined) setValue('innleggelsesPeriode.til', dato?.to!!, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            })
        }
    });


    const onSubmit = (data: LegeerklaeringFormData) => {
        setSubmittedData(data)
        console.log("Form data", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Section
                title={tekst("legeerklaering.om-barnet.tittel")}
                helpText={tekst("legeerklaering.om-barnet.hjelpetekst")}
            >
                <TextField
                    label={tekst("legeerklaering.felles.navn.label")}
                    defaultValue={defaultValues?.barn?.navn}
                    {...register("barn.navn", {required: true})}
                    error={errors.barn?.navn?.message}
                    className="w-1/2 mb-4"
                />
                <div className="mb-4">
                    <TextField
                        label={tekst("legeerklaering.om-barnet.ident.label")}
                        defaultValue={defaultValues?.barn?.ident}
                        {...register("barn.ident", {required: true})}
                        error={errors.barn?.ident?.message}
                        className="w-1/2 mb-4"
                    />
                    <DatePicker{...barnFoedselDatepickerProps}>
                        <DatePicker.Input
                            label={tekst("legeerklaering.om-barnet.foedselsdato.label")}
                            {...barnFoedselsInputProps}
                            error={errors.barn?.foedselsdato?.message}
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
                        <HoveddiagnoseSelect className="mb-4" value={value} onChange={onChange}  />
                    )}
                />

                <Controller
                    control={control}
                    name="bidiagnoser"
                    render={({field: {onChange, value}}) => (
                        <BidiagnoseSelect className="mb-4" value={value} onChange={onChange} />
                    )}
                />
            </Section>

            <Section
                title={tekst("legeerklaering.tilsyn-varighet.tittel")}
                helpText={tekst("legeerklaering.tilsyn-varighet.hjelpetekst")}
            >
                <div className="flex space-x-4">
                    <DatePicker {...tilsynDatepickerProps} onChange={(event) => console.log(event)}>
                        <div className="flex flex-wrap justify-center gap-4">
                            <DatePicker.Input
                                label={tekst("legeerklaering.tilsyn-varighet.fom.label")}
                                {...tilsynFraInputProps}
                                {...register("tilsynPeriode.fra", {required: true})}
                                value={tilsynFraInputProps.value}
                                error={errors.tilsynPeriode?.fra?.message}
                            />
                            <DatePicker.Input
                                label={tekst("legeerklaering.tilsyn-varighet.tom.label")}
                                {...tilsynTilInputProps}
                                {...register("tilsynPeriode.til", {required: true})}
                                value={tilsynTilInputProps.value}
                                error={errors.tilsynPeriode?.til?.message}
                            />
                        </div>
                    </DatePicker>
                </div>
            </Section>

            <Section title={tekst("legeerklaering.innleggelse-varighet.tittel")}>
                <div className="flex space-x-4">
                    <DatePicker {...innleggelseDatepickerProps}>
                        <div className="flex flex-wrap justify-center gap-4">
                            <DatePicker.Input
                                label={tekst("legeerklaering.innleggelse-varighet.fom.label")}
                                {...innleggelseFraInputProps}
                                {...register("innleggelsesPeriode.fra", {required: true})}
                                value={innleggelseFraInputProps.value}
                                error={errors.innleggelsesPeriode?.fra?.message}
                            />
                            <DatePicker.Input
                                label={tekst("legeerklaering.innleggelse-varighet.tom.label")}
                                {...innleggelseTilInputProps}
                                {...register("innleggelsesPeriode.til", {required: true})}
                                value={innleggelseTilInputProps.value}
                                error={errors.innleggelsesPeriode?.til?.message}
                            />
                        </div>
                    </DatePicker>
                </div>
            </Section>

            <Section title={tekst("legeerklaering.om-legen.tittel")}>
                <TextField
                    label={tekst("legeerklaering.felles.navn.label")}
                    defaultValue={defaultValues?.lege?.navn}
                    {...register("lege.navn", {required: true})}
                    error={errors.lege?.navn?.message}
                    className="mb-4 w-1/2"
                />
                <TextField
                    label={tekst("legeerklaering.om-legen.hrp-nummer.label")}
                    defaultValue={defaultValues?.lege?.hrpNummer}
                    {...register("lege.hrpNummer", {required: true})}
                    error={errors.lege?.hrpNummer?.message}
                    className="w-1/2"
                />
            </Section>

            <Section title="Opplysninger om sykehuset">
                <div className="flex space-x-4 mb-4">
                    <TextField
                        label={tekst("legeerklaering.felles.navn.label")}
                        {...register("sykehus.navn", {required: true})}
                        error={errors.sykehus?.navn?.message}
                        className="w-3/4"
                    />
                    <TextField
                        label={tekst("legeerklaering.om-sykehuset.tlf.label")}
                        type="tel"
                        {...register("sykehus.telefon", {required: true})}
                        error={errors.sykehus?.telefon?.message}
                        className="w-1/4"
                    /></div>
                <TextField
                    label={tekst("legeerklaering.om-sykehuset.gateadresse.label")}
                    defaultValue={defaultValues?.sykehus?.adresse?.gate}
                    {...register("sykehus.adresse.gate", {required: true})}
                    error={errors.sykehus?.adresse?.gate?.message}
                    className="mb-4 w-3/4"
                />
                <div className="flex mb-4 space-x-4">
                    <TextField
                        label={tekst("legeerklaering.om-sykehuset.postnummer.label")}
                        defaultValue={defaultValues?.sykehus?.adresse?.postnummer}
                        type="number"
                        {...register("sykehus.adresse.postnummer", {required: true})}
                        error={errors.sykehus?.adresse?.postnummer?.message}
                        className="w-1/4"
                    />
                    <TextField
                        label={tekst("legeerklaering.om-sykehuset.poststed.label")}
                        defaultValue={defaultValues?.sykehus?.adresse?.poststed}
                        {...register("sykehus.adresse.poststed", {required: true})}
                        error={errors.sykehus?.adresse?.poststed?.message}
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
