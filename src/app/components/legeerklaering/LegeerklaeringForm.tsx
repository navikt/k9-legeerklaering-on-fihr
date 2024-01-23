import React, { useState } from 'react';
import {
    Alert,
    BodyShort,
    Button,
    Heading,
    HStack,
    ReadMore,
    Textarea,
    TextField,
    useDatepicker,
    VStack
} from '@navikt/ds-react';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';
import Section from '@/app/components/Section';
import { tekst } from '@/utils/tekster';
import HoveddiagnoseSelect from "@/app/components/diagnosekoder/HoveddiagnoseSelect";
import BidiagnoseSelect from "@/app/components/diagnosekoder/BidiagnoseSelect";
import Practitioner from "@/models/Practitioner";
import Patient from "@/models/Patient";
import Hospital from "@/models/Hospital";
import { yupResolver } from "@hookform/resolvers/yup";
import MultiDatePeriodInput, { DatePeriodInput } from "@/app/components/multidateperiod/MultiDatePeriodInput";
import { logger } from '@navikt/next-logger';
import { componentSize } from '@/utils/constants';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import LegeerklaeringDokument from "@/models/LegeerklaeringDokument";
import { randomLegeerklaeringDokumentReferanse } from "@/models/LegeerklaeringDokumentReferanse";
import { legeerklaeringDokumentSchema } from "@/app/components/legeerklaering/legeerklaeringDokumentSchema";

export interface EhrInfoLegeerklaeringForm {
    readonly doctor: Practitioner | undefined;
    readonly patient: Patient | undefined;
    readonly hospital: Hospital | undefined;
    onFormSubmit: (data: LegeerklaeringDokument) => Promise<void>
}

export default function LegeerklaeringForm({doctor, hospital, onFormSubmit, patient}: EhrInfoLegeerklaeringForm) {
    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: {errors, defaultValues},
    } = useForm<LegeerklaeringDokument>({
        resolver: yupResolver(legeerklaeringDokumentSchema),
        defaultValues: {
            dokumentReferanse: randomLegeerklaeringDokumentReferanse(),
            dokumentAnsvarlig: doctor?.departmentReference,
            barn: {
                name: patient?.name,
                ehrId: patient?.ehrId,
                fnr: patient?.fnr,
                birthDate: patient?.birthDate,
            },
            lege: {
                hprNumber: doctor?.hprNumber,
                name: doctor?.name,
                activeSystemUser: doctor?.activeSystemUser || false,
                ehrId: doctor?.ehrId,
                practitionerRoleId: doctor?.practitionerRoleId,
                departmentReference: doctor?.departmentReference,
            },
            sykehus: {
                name: hospital?.name,
                phoneNumber: hospital?.phoneNumber,
                address: {
                    line1: hospital?.address?.line1,
                    line2: hospital?.address?.line2,
                    postalCode: hospital?.address?.postalCode,
                    city: hospital?.address?.city,
                }
            },
            hoveddiagnose: undefined,
            bidiagnoser: [],
            vurderingAvBarnet: undefined,
            vurderingAvOmsorgspersoner: undefined,
            tilsynPeriode: {
                start: undefined,
                end: undefined,
            },
            innleggelsesPerioder: [{
                start: undefined,
                end: undefined,
            }],
        }
    })

    const {
        datepickerProps: barnFoedselDatepickerProps,
        inputProps: barnFoedselsInputProps
    } = useDatepicker({
        defaultSelected: patient?.birthDate,
        onDateChange: (dato) => {
            setValue('barn.birthDate', dato, {shouldDirty: true, shouldTouch: true, shouldValidate: true})
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (data: LegeerklaeringDokument) => {
        try {
            setIsSubmitting(true)
            await onFormSubmit(data)
        } finally {
            setIsSubmitting(false)
        }
    };

    const onError: SubmitErrorHandler<LegeerklaeringDokument> = errors => {
        logger.warn("form validation errors", errors)
    }

    const erOver18 = (fødselsdato: Date | undefined): boolean => {
        if (!fødselsdato) {
            return false;
        }

        const idag = new Date();
        const attenÅrSiden = new Date(idag.getFullYear() - 18, idag.getMonth(), idag.getDate());
        return fødselsdato <= attenÅrSiden;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            {erOver18(defaultValues?.barn?.birthDate) && <VStack className="mt-4" gap="4">
                <Alert variant="warning" size="small">
                    <Heading size="small">Obs! Pasienten er over 18 år</Heading>
                    <BodyShort size="small">
                        Du må inkludere i vurderingen av barnets tilstand om pasienten er utviklingshemmet i tillegg til
                        svært alvorlig eller livstruende syk.
                    </BodyShort>
                </Alert>
            </VStack>
            }

            <Section>
                <TextField
                    size={componentSize}
                    label={tekst("legeerklaering.om-barnet.tittel")}
                    readOnly
                    defaultValue={`${defaultValues?.barn?.name} (${defaultValues?.barn?.fnr})`}
                    className="w-1/2"
                />
            </Section>

            <Section>
                <Textarea
                    size={componentSize}
                    label={tekst("legeerklaering.legens-vurdering.barn.label")}
                    description={
                        <ReadMore size={componentSize}
                                  header={tekst("legeerklaering.legens-vurdering.barn.les-mer.tittel")}>
                            {tekst("legeerklaering.legens-vurdering.barn.les-mer.tekst")}
                        </ReadMore>
                    }
                    {...register("vurderingAvBarnet", {required: true})}
                    error={errors.vurderingAvBarnet?.message}
                    minRows={5}
                />
            </Section>

            <Section>
                <Textarea
                    size={componentSize}
                    label={tekst("legeerklaering.legens-vurdering.omsorgsperson.label")}
                    description={
                        <ReadMore size={componentSize}
                                  header={tekst("legeerklaering.legens-vurdering.omsorgsperson.les-mer.tittel")}>
                            {tekst("legeerklaering.legens-vurdering.omsorgsperson.les-mer.tekst")}
                        </ReadMore>
                    }
                    {...register("vurderingAvOmsorgspersoner", {required: true})}
                    error={errors.vurderingAvOmsorgspersoner?.message}
                    minRows={5}
                />
            </Section>

            <Section>
                <Controller
                    control={control}
                    name="hoveddiagnose"
                    render={({field: {onChange, value}}) => (
                        <HoveddiagnoseSelect className="mb-2" value={value} onChange={onChange}
                                             error={errors.hoveddiagnose?.code?.message || errors.hoveddiagnose?.text?.message}/>
                    )}
                />

                <Controller
                    control={control}
                    name="bidiagnoser"
                    render={({field: {onChange, value}}) => (
                        <BidiagnoseSelect className="mb-4" value={value} onChange={onChange}
                                          error={errors.bidiagnoser?.message}/>
                    )}
                />
            </Section>

            <Section
                title={tekst("legeerklaering.innleggelse-varighet.tittel")}
            >
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

            <Section
                title={tekst("legeerklaering.tilsyn-varighet.tittel")}
            >
                <Controller
                    control={control}
                    name="tilsynPeriode"
                    render={({field: {onChange, value}}) => (
                        <DatePeriodInput
                            value={value}
                            onChange={onChange}
                            error={errors.tilsynPeriode?.start?.message || errors.tilsynPeriode?.end?.message}
                        />
                    )}
                />
            </Section>

            <VStack className="mt-8" gap={"4"}>
                <HStack>
                    <Button
                        size={componentSize}
                        type="submit"
                        icon={<ChevronRightIcon aria-hidden/>}
                        iconPosition="right"
                        loading={isSubmitting}
                    >
                        Lagre
                    </Button>
                </HStack>
            </VStack>
        </form>
    )
}
