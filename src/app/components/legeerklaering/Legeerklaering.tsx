import React, { useContext } from 'react';
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
    useDatepicker
} from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import { LegeerklaeringTekster } from '@/app/components/legeerklaering/legeerklaering-tekster';
import Section from '@/app/components/Section';

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
    foedselsdato: Date;
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
    hoveddiagnosekode: string;
    bidiagnoser: Diagnose[];
    tilsynPeriode: Periode;
    lege: Lege;
    sykehus: Sykehus;
};

export default function Legeerklaering() {
    const {datepickerProps, inputProps} = useDatepicker({
        today: new Date(),
        onDateChange: console.log,
    });

    const {patient, practitioner, client} = useContext(FHIRContext);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LegeerklaeringFormData>();

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


    const onSubmit = (data: any) => {
        console.log(data);
    };

    const pasientNavn = patient?.name?.pop();
    const pasientensFulleNavn = pasientNavn !== undefined ? `${pasientNavn?.family}, ${pasientNavn?.given?.pop()}` : "";

    const legensNavn = practitioner?.name?.pop();
    const legensFulleNavn = legensNavn !== undefined ? `${legensNavn?.family}, ${legensNavn?.given?.pop()}` : "";
    console.log("Legeerklæring", practitioner);
    return <form onSubmit={handleSubmit(onSubmit)}>
        <>
            <Section
                title={LegeerklaeringTekster['legeerklaering.om-barnet.tittel']}
                helpText="Hvis barnet ikke har fått fødselsnummer enda skriver du inn barnets fødselsdato."
            >
                <TextField
                    label="Barnets navn"
                    defaultValue={pasientensFulleNavn}
                    {...register("barn.navn", {required: true})}
                    error={errors.barn?.navn ? "Barnets navn er påkrevd" : ""}
                    className="w-1/2 mb-4"
                />
                <div className="mb-4">
                    <TextField
                        label="Barnets fødselsnummer"
                        {...register("barn.ident", {required: true})}
                        error={errors.barn?.ident ? "Barnets norske ID er påkrevd" : ""}
                        className="w-1/2 mb-4"
                    />
                    <DatePicker{...datepickerProps}>
                        <DatePicker.Input
                            {...inputProps}
                            {...register("barn.foedselsdato", {required: true})}
                            error={errors.barn?.foedselsdato ? "Fra og med dato er påkrevd" : ""}
                            label="Barnets fødselsdato"
                        />
                    </DatePicker>
                </div>
            </Section>

            <Section
                title="Legens vurdering av barnets tilstand"
                helpText="Her skal du gi din vurdering av barnets nåværende tilstand og funksjonsnivå. I tillegg må du gi en vurdering av forventet tilstand i perioden barnet har behov for tilsyn og pleie."
            >
                <ReadMore size='small' header="Beskrivelse av barnets medisinske tilstand og funksjonsnivå"
                          className="mb-8">
                    1. Beskriv barnets medisinske tilstand og funksjonsnivå. Gi en vurdering av behovet for kontinuerlig
                    tilsyn og pleie, samt sykdomsutvikling og prognose.<br/><br/>
                    2. Gi en vurdering av om det er behov én eller to personer samtidig for å pleie og/eller ha tilsyn
                    med barnet når barnet er hjemme.<br/><br/>
                    Merk: Hvis pasienten er over 18 må du gi en vurdering av om pasienten er utviklingshemmet og svært
                    alvorlig eller livstruende syk.
                </ReadMore>
                <Textarea
                    label="Vurdering av barnets tilstand"
                    {...register("legensVurdering", {required: true})}
                    error={errors.legensVurdering ? "Legens vurdering er påkrevd" : ""}
                    minRows={10}
                />
            </Section>

            <Section
                title="Diagnose"
                helpText="Benytt kodene fra ICD-10 hvis det er satt en diagnose. Hvis barnet er under utredning og det ikke er fastsatt noen diagnose trenger du ikke skrive noe her."
            >

                <Select
                    label="Hoveddiagnosekode"
                    {...register("hoveddiagnosekode", {required: true})}
                    error={errors.hoveddiagnosekode ? "Hoveddiagnosekode er påkrevd" : ""}
                    className="w-1/2 mb-4"
                >
                    {diagnoser.map((diagnose) => (
                        <option key={diagnose.kode}
                                value={diagnose.term}>{diagnose.kode} - {diagnose.term}</option>
                    ))}
                </Select>

                <Select
                    label="Bidiagnose(r)"
                    {...register("bidiagnoser", {required: true})}
                    error={errors.bidiagnoser ? "Bidiagnose(r) er påkrevd" : ""}
                    className="w-1/2 mb-4"
                >
                    {diagnoser.map((diagnose) => (
                        <option key={diagnose.kode}
                                value={diagnose.term}>{diagnose.kode} - {diagnose.term}</option>
                    ))}
                </Select>
            </Section>

            <Section
                title="Forventet varighet på tilsyns- og pleiebehovet"
                helpText="Her skal du sette en dato på hvor langt fram i tid du forventer at barnet har behov for kontinuerlig tilsyn og pleie. Hvis du er usikker på varigheten setter du en dato så langt frem i tid som du er sikker på per nå."
            >
                <div className="flex space-x-4">
                    <DatePicker{...datepickerProps}>
                        <DatePicker.Input
                            {...inputProps}
                            {...register("tilsynPeriode.fra", {required: true})}
                            error={errors.tilsynPeriode?.fra ? "Fra og med dato er påkrevd" : ""}
                            label="Fra og med dato"
                        />
                    </DatePicker>
                    <DatePicker{...datepickerProps}>
                        <DatePicker.Input
                            {...inputProps}
                            {...register("tilsynPeriode.til", {required: true})}
                            error={errors.tilsynPeriode?.til ? "Til og med dato er påkrevd" : ""}
                            label="Til og med dato"/>
                    </DatePicker>
                </div>
            </Section>

            <Section title="Perioder for innleggelser på helseinstitusjon">
                <div className="flex space-x-4">
                    <DatePicker{...datepickerProps}>
                        <DatePicker.Input
                            {...inputProps}
                            {...register("tilsynPeriode.fra", {required: true})}
                            error={errors.tilsynPeriode?.fra ? "Fra og med dato er påkrevd" : ""}
                            label="Fra og med dato"
                        />
                    </DatePicker>
                    <DatePicker{...datepickerProps}>
                        <DatePicker.Input
                            {...inputProps}
                            {...register("tilsynPeriode.til", {required: true})}
                            error={errors.tilsynPeriode?.til ? "Til og med dato er påkrevd" : ""}
                            label="Til og med dato"/>
                    </DatePicker>
                </div>
            </Section>

            <Section title="Opplysninger om legen">
                <TextField
                    defaultValue={legensFulleNavn}
                    label="Legens navn"
                    {...register("lege.navn", {required: true})}
                    error={errors.lege?.navn ? "Legens navn er påkrevd" : ""}
                    className="mb-4 w-1/2"
                />
                <TextField
                    label="Legens HRP-nummer"
                    {...register("lege.hrpNummer", {required: true})}
                    error={errors.lege?.hrpNummer ? "Legens HRP-nummer er påkrevd" : ""}
                    className="w-1/2"
                />
            </Section>

            <Section title="Opplysninger om sykehuset">
                <div className="flex space-x-4 mb-4">
                    <TextField
                        label="Sykehusets navn"
                        {...register("sykehus.navn", {required: true})}
                        error={errors.sykehus?.navn ? "Sykehusets navn er påkrevd" : ""}
                        className="w-1/2"
                    />
                    <TextField
                        label="Sykehusets telefonnummer"
                        type="tel"
                        {...register("sykehus.telefon", {required: true})}
                        error={errors.sykehus?.telefon ? "Sykehusets telefonnummer er påkrevd" : ""}
                        className="w-1/3"
                    /></div>
                <TextField
                    label="Gateadresse"
                    {...register("sykehus.adresse.gate", {required: true})}
                    error={errors.sykehus?.adresse?.gate ? "Gateadresse er påkrevd" : ""}
                    className="mb-4"
                />
                <div className="flex mb-4 space-x-4">
                    <TextField
                        label="Postnummer"
                        {...register("sykehus.adresse.postnummer", {required: true})}
                        error={errors.sykehus?.adresse?.postnummer ? "Postnummer er påkrevd" : ""}
                        className="w-1/4"
                    />
                    <TextField
                        label="Poststed"
                        type="number"
                        max={9999}
                        {...register("sykehus.adresse.poststed", {required: true})}
                        error={errors.sykehus?.adresse?.poststed ? "Poststed er påkrevd" : ""}
                        className="w-1/2"
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
