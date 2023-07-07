import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FHIRContext } from '@/app/context/FHIRContext';
import {
    BodyLong,
    Button,
    DatePicker,
    Link,
    ReadMore,
    Select,
    Textarea,
    TextField,
    useDatepicker, useRangeDatepicker
} from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import Section from '@/app/components/Section';
import { tekst } from '@/utils/tekster';
import { IAddress, IPatient, IPractitioner } from '@ahryman40k/ts-fhir-types/lib/R4';

type Periode = {
    fra: Date;
    til: Date;
}

type Diagnose = {
    kode: string;
    term: string;
}

type Barn = {
    navn: string;
    ident: string;
    foedselsdato?: Date;
}

type Lege = {
    navn: string;
    hrpNummer: string;
}

type Adresse = {
    gate: string;
    postnummer: string;
    poststed: string;
}

type Sykehus = {
    navn: string;
    telefon: string;
    adresse: Adresse;
}

type LegeerklaeringFormData = {
    barn: Barn;
    legensVurdering: string;
    hoveddiagnose: Diagnose;
    bidiagnoser: Diagnose[];
    tilsynPeriode: Periode;
    innleggelsesPeriode: Periode;
    lege: Lege;
    sykehus: Sykehus;
};

export default function Legeerklaering() {
    const {patient, practitioner, client} = useContext(FHIRContext);
    const [state, setState] = useState<LegeerklaeringFormData>({
        barn: {
            navn: "",
            ident: "",
            foedselsdato: undefined,
        },
        lege: {
            hrpNummer: "",
            navn: "",
        },
        sykehus: {
            navn: "",
            telefon: "",
            adresse: {
                gate: "",
                postnummer: "",
                poststed: "",
            }
        },
        hoveddiagnose: {
            kode: "",
            term: ""
        },
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
    });

    // Create a memoized version of setDefaultPasientFormFelter to avoid unnecessary re-renders.
    const setDefaultPasientFormFelter = useCallback((patient: IPatient) => {
        const pasientNavn = patient?.name?.pop();
        const pasientensFulleNavn = pasientNavn !== undefined ? `${pasientNavn?.family}, ${pasientNavn?.given?.pop()}` : "";
        const pasientensIdent = patient?.identifier?.pop()?.value || "";
        const pasientensFoedselsdag = patient?.birthDate ? new Date(patient?.birthDate) : undefined;

        setValue('barn.navn', pasientensFulleNavn)
        setValue('barn.ident', pasientensIdent)
        setValue('barn.foedselsdato', pasientensFoedselsdag)

        setState(prevState => ({
            ...prevState,
            barn: {
                navn: pasientensFulleNavn,
                foedselsdato: pasientensFoedselsdag,
                ident: pasientensIdent,
            },
        }));
    }, []);

    const setDefaultLegeFelter = useCallback((practitioner: IPractitioner) => {
        const legensNavn = practitioner?.name?.pop();
        const legensFulleNavn = legensNavn ? `${legensNavn?.family}, ${legensNavn?.given?.pop()}` : "";
        const legensId = practitioner.id || "";

        const adresse: IAddress | undefined = practitioner?.address?.pop();
        const gate = adresse?.line?.pop() || "";
        const postnummer = adresse?.postalCode || "";
        const poststed = adresse?.city || "";

        setValue('lege.navn', legensFulleNavn)
        setValue('lege.hrpNummer', legensId)
        setValue('sykehus.adresse.gate', gate)
        setValue('sykehus.adresse.postnummer', postnummer)
        setValue('sykehus.adresse.poststed', poststed)

        setState(prevState => ({
            ...prevState,
            lege: {
                navn: legensFulleNavn,
                hrpNummer: legensId,
            },
            sykehus: {
                ...prevState.sykehus,
                adresse: {
                    gate: gate,
                    postnummer: postnummer,
                    poststed: poststed,
                }
            }
        }));
    }, []);

    const {
        register,
        setValue,
        handleSubmit,
        formState: {errors},
        watch
    } = useForm<LegeerklaeringFormData>()

    useEffect(() => {
        if (!patient || !practitioner) {
            if (!patient) console.log('Patient data is not yet available');
            if (!practitioner) console.log('Practitioner data is not yet available');
        } else {
            console.log('Patient and practitioner data are available', {patient, practitioner, client});
            setDefaultPasientFormFelter(patient);
            setDefaultLegeFelter(practitioner);
        }

    }, [patient, practitioner, client, setDefaultPasientFormFelter, setDefaultLegeFelter]);

    const {
        datepickerProps: barnFoedselDatepickerProps,
        inputProps: barnFoedselsInputProps
    } = useDatepicker({
        defaultSelected: state.barn.foedselsdato,
        onDateChange: (dato) => {
            setValue('barn.foedselsdato', dato!!, {shouldDirty: true, shouldTouch: true, shouldValidate: true})
        }
    });

    const {
        datepickerProps: tilsynDatepickerProps,
        fromInputProps: tilsynFraInputProps,
        toInputProps: tilsynTilInputProps,
        selectedRange: valgtTilsynPeriode
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
        selectedRange: valgtInnleggelsePeriode
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


    const diagnoser: Diagnose[] = [
        {
            kode: "A00",
            term: "Kolera"
        },
        {
            kode: "A01",
            term: "Tyfoid- og paratyfoidfeber"
        },
        {
            kode: "A02",
            term: "Andre salmonellose"
        }
    ];

    console.log("form errors", errors);
    console.log("form watch", watch());

    const onSubmit = (data: any) => {
        console.log("Form data", data);
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <>
            <Section
                title={tekst("legeerklaering.om-barnet.tittel")}
                helpText={tekst("legeerklaering.om-barnet.hjelpetekst")}
            >
                <TextField
                    label={tekst("legeerklaering.felles.navn.label")}
                    defaultValue={state.barn.navn}
                    {...register("barn.navn", {required: true})}
                    error={errors.barn?.navn ? tekst("legeerklaering.om-barnet.navn.paakrevd") : ""}
                    className="w-1/2 mb-4"
                />
                <div className="mb-4">
                    <TextField
                        label={tekst("legeerklaering.om-barnet.ident.label")}
                        defaultValue={state.barn.ident}
                        {...register("barn.ident", {required: true})}
                        error={errors.barn?.ident ? tekst("legeerklaering.om-barnet.ident.paakrevd") : ""}
                        className="w-1/2 mb-4"
                    />
                    <DatePicker{...barnFoedselDatepickerProps}>
                        {/*TODO: Fiks default value. Barnets fødselsdato er ikke valgt i datepicker.*/}
                        <DatePicker.Input
                            label={tekst("legeerklaering.om-barnet.foedselsdato.label")}
                            {...barnFoedselsInputProps}
                            {...register("barn.foedselsdato", {required: true})}
                            value={barnFoedselsInputProps.value}
                            error={errors.barn?.foedselsdato ? tekst("legeerklaering.om-barnet.foedselsdato.paakrevd") : ""}
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
                    error={errors.legensVurdering ? tekst("legeerklaering.legens-vurdering.paakrevd") : ""}
                    minRows={10}
                />
            </Section>

            <Section
                title={tekst("legeerklaering.diagnose.tittel")}
                helpText={tekst("legeerklaering.diagnose.hjelpetekst")}
            >
                <Select
                    label={tekst("legeerklaering.diagnose.hoveddiagnose.label")}
                    {...register("hoveddiagnose", {required: true})}
                    error={errors.hoveddiagnose ? tekst("legeerklaering.diagnose.hoveddiagnose.paakrevd") : ""}
                    className="w-1/2 mb-4"
                >
                    {diagnoser.map((diagnose) => (
                        <option key={diagnose.kode}
                                value={diagnose.term}>{diagnose.kode} - {diagnose.term}</option>
                    ))}
                </Select>

                <Select
                    label={tekst("legeerklaering.diagnose.bidiagnoser.label")}
                    {...register("bidiagnoser", {required: true})}
                    error={errors.bidiagnoser ? tekst("legeerklaering.diagnose.bidiagnoser.paakrevd") : ""}
                    className="w-1/2 mb-4"
                >
                    {diagnoser.map((diagnose) => (
                        <option key={diagnose.kode}
                                value={diagnose.term}>{diagnose.kode} - {diagnose.term}</option>
                    ))}
                </Select>
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
                                error={errors.tilsynPeriode?.fra ? tekst("legeerklaering.tilsyn-varighet.fom.paakrevd") : ""}
                            />
                            <DatePicker.Input
                                label={tekst("legeerklaering.tilsyn-varighet.tom.label")}
                                {...tilsynTilInputProps}
                                {...register("tilsynPeriode.til", {required: true})}
                                value={tilsynTilInputProps.value}
                                error={errors.tilsynPeriode?.til ? tekst("legeerklaering.tilsyn-varighet.tom.paakrevd") : ""}
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
                                error={errors.innleggelsesPeriode?.fra ? tekst("legeerklaering.innleggelse-varighet.fom.paakrevd") : ""}
                            />
                            <DatePicker.Input
                                label={tekst("legeerklaering.innleggelse-varighet.tom.label")}
                                {...innleggelseTilInputProps}
                                {...register("innleggelsesPeriode.til", {required: true})}
                                value={innleggelseTilInputProps.value}
                                error={errors.innleggelsesPeriode?.til ? tekst("legeerklaering.innleggelse-varighet.tom.paakrevd") : ""}
                            />
                        </div>
                    </DatePicker>
                </div>
            </Section>

            <Section title={tekst("legeerklaering.om-legen.tittel")}>
                <TextField
                    label={tekst("legeerklaering.felles.navn.label")}
                    defaultValue={state.lege.navn}
                    {...register("lege.navn", {required: true})}
                    error={errors.lege?.navn ? tekst("legeerklaering.om-legen.navn.paakrevd") : ""}
                    className="mb-4 w-1/2"
                />
                <TextField
                    label={tekst("legeerklaering.om-legen.hrp-nummer.label")}
                    defaultValue={state.lege.hrpNummer}
                    {...register("lege.hrpNummer", {required: true})}
                    error={errors.lege?.hrpNummer ? tekst("legeerklaering.om-legen.hrp-nummer.paakrevd") : ""}
                    className="w-1/2"
                />
            </Section>

            <Section title="Opplysninger om sykehuset">
                <div className="flex space-x-4 mb-4">
                    <TextField
                        label={tekst("legeerklaering.felles.navn.label")}
                        {...register("sykehus.navn", {required: true})}
                        error={errors.sykehus?.navn ? tekst("legeerklaering.om-sykuset.navn.paakrevd") : ""}
                        className="w-3/4"
                    />
                    <TextField
                        label={tekst("legeerklaering.om-sykuset.tlf.label")}
                        type="tel"
                        {...register("sykehus.telefon", {required: true})}
                        error={errors.sykehus?.telefon ? tekst("legeerklaering.om-sykuset.tlf.paakrevd") : ""}
                        className="w-1/4"
                    /></div>
                <TextField
                    label={tekst("legeerklaering.om-sykuset.gateadresse.label")}
                    defaultValue={state.sykehus.adresse.gate}
                    {...register("sykehus.adresse.gate", {required: true})}
                    error={errors.sykehus?.adresse?.gate ? tekst("legeerklaering.om-sykuset.gateadresse.paakrevd") : ""}
                    className="mb-4 w-3/4"
                />
                <div className="flex mb-4 space-x-4">
                    <TextField
                        label={tekst("legeerklaering.om-sykuset.postnummer.label")}
                        defaultValue={state.sykehus.adresse.postnummer}
                        type="number"
                        {...register("sykehus.adresse.postnummer", {required: true})}
                        error={errors.sykehus?.adresse?.postnummer ? tekst("legeerklaering.om-sykuset.postnummer.paakrevd") : ""}
                        className="w-1/4"
                    />
                    <TextField
                        label={tekst("legeerklaering.om-sykuset.poststed.label")}
                        defaultValue={state.sykehus.adresse.poststed}
                        {...register("sykehus.adresse.poststed", {required: true})}
                        error={errors.sykehus?.adresse?.poststed ? tekst("legeerklaering.om-sykuset.poststed.paakrevd") : ""}
                        className="w-3/4"
                    />
                </div>
            </Section>

            <div className="ml-4 mt-4 mb-16"><Button type="submit">Registrer</Button></div>

            <Section title="Kontakt oss">
                <BodyLong>
                    Har du flere spørsmål eller behov for mer veiledning? Her finner du mer <Link
                    target="_blank"
                    href="https://www.nav.no/samarbeidspartner/pleiepenger-barn#legeerklering-pleiepenger"> informasjon
                    for helsepersonell om pleiepenger for sykt barn</Link>. Du kan også ringe oss på
                    telefon
                    55 55 33 36.
                </BodyLong>
            </Section>
        </>
    </form>
}
