'use client'
import CenterColumn from "../../CenterColumn";
import InitDataDependentRender from "../../InitDataDependentRender";
import React, { useContext} from "react";
import { BaseApiContext } from "../../BaseApi";
import PaddedPanel from "../../PaddedPanel";
import {
    Box,
    Button,
    CheckboxGroup,
    Checkbox,
    Heading,
    HStack,
    Label,
    ReadMore,
    Textarea,
} from "@navikt/ds-react";
import Section from "@/app/components/Section";
import { tekst } from "@/utils/tekster";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import HoveddiagnoseSelect from "@/app/components/diagnosekoder/HoveddiagnoseSelect";
import BidiagnoseSelect from "@/app/components/diagnosekoder/BidiagnoseSelect";
import MultiDatePeriodInput from "@/app/components/multidateperiod/MultiDatePeriodInput";
import { ObjectSchema } from "yup";
import * as yup from "yup";
import { Diagnosekode } from "@navikt/diagnosekoder";
import DatePeriod from "@/models/DatePeriod";
import { yupResolver } from "@hookform/resolvers/yup";
import { logger } from "@navikt/next-logger";

interface FormData {
    legensVurdering: string;
    hoveddiagnose?: Diagnosekode;
    bidiagnoser: Diagnosekode[];
    tilsynPerioder: DatePeriod[];
    innleggelsesPerioder: DatePeriod[];
    omsorgspersoner: string[];
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


const schema: ObjectSchema<FormData> = yup.object({
    hoveddiagnose: diagnosekodeValidation.optional().default(undefined),
    bidiagnoser: yup.array().of(diagnosekodeValidation).required(),
    legensVurdering: yup.string().trim().required(tekst("legeerklaering.legens-vurdering.paakrevd")),
    tilsynPerioder: yup.array().of(datePeriodValidation).min(1, ({min}) => `Minimum ${min} periode må spesifiseres`).required(),
    innleggelsesPerioder: yup.array().of(datePeriodValidation).required(),
    omsorgspersoner: yup.array().of(yup.string().trim().required()).min(0, "Minst en omsorgsperson er påkrevd").required()
})


const Page = () => {
    const api = useContext(BaseApiContext)

    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: {errors, defaultValues},
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            hoveddiagnose: undefined,
            bidiagnoser: [],
            legensVurdering: undefined,
            tilsynPerioder: [{
                start: undefined,
                end: undefined,
            }],
            innleggelsesPerioder: [],
            omsorgspersoner: []
        }
    })

    const onSubmit = (data: FormData) => {
        logger.info("TODO Submit form data", data);
    };

    const onError: SubmitErrorHandler<FormData> = errors => {
        logger.warn("form validation errors", errors)
    }


    return <CenterColumn>
        <InitDataDependentRender baseApi={api} render={(initData) => {
            return <>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <PaddedPanel>
                    <Heading spacing level="2" size="medium">Om barnet </Heading>
                    <Label>{initData.patient.name}</Label> - Fødselsdato {initData.patient.birthDate?.toLocaleDateString()} <small>({initData.patient.fnr})</small>
                </PaddedPanel>
                <PaddedPanel>
                    <Controller name="omsorgspersoner" control={control} render={({field: {onChange, value}}) => (
                        <CheckboxGroup
                            legend={<Heading level="2" size="medium">Omsorgspersoner</Heading>}
                            value={value}
                            onChange={onChange}
                            error={errors.omsorgspersoner?.message}
                            // description="De personer som blir valgt her får tilgang til å lese og bruke legeerklæringen"
                            description={
                                <ReadMore size="small" header="De personer som blir valgt her får tilgang til å lese og bruke legeerklæringen">
                                    <p>
                                        Dette tilsvarer at du tidligere ville skrevet ut og levert legeerklæringen på papir til disse personene,
                                        slik at de kunne søke om pleiepenger.
                                    </p>
                                    <p>Det er derfor viktig at du tenker på personvern og kontrollerer
                                        at disse faktisk skal ha tilgang til informasjonen i legeerklæringen.
                                    </p>
                                    <p>
                                        Hvis den/de som skal bruke legeerklæringen ikke viser her må du få lagt de inn som relaterte personer
                                        på pasienten i ditt journalsystem, og oppfriske.
                                    </p>
                                </ReadMore>
                            }
                        >
                            {
                                api.initData?.patient.caretakers.map(relatedPerson => (
                                    <Checkbox key={`rp${relatedPerson.ehrId}`} value={relatedPerson.ehrId} >{relatedPerson.name} <small>({relatedPerson.fnr})</small></Checkbox>
                                ))
                            }
                        </CheckboxGroup>
                    )} />
                </PaddedPanel>
                <PaddedPanel>
                    <Heading spacing level="2" size="medium">{tekst("legeerklaering.legens-vurdering.tittel")}</Heading>
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
                </PaddedPanel>

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

                <Box padding="4">
                <HStack gap="4">
                    <Button variant="secondary" type="submit">Lagre</Button>
                    <Button variant="secondary">Godkjenn</Button>
                    <Button disabled>Send til NAV</Button>
                </HStack>
                </Box>
            </form>
            </>
        }} />
    </CenterColumn>
}

export default Page;