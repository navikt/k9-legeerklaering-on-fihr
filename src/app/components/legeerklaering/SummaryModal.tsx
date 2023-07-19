import {Accordion, Heading, Ingress, List, Modal} from "@navikt/ds-react";
import {tekst} from "@/utils/tekster";
import React from "react";
import {LegeerklaeringFormData} from "@/models/legeerklæring";

export interface SummaryModalProps {
    readonly show: boolean;
    readonly onClose: () => void;
    readonly data: LegeerklaeringFormData | null;
}

const SummaryModal = ({show, onClose, data}: SummaryModalProps) => {
    return data !== null ? (
        <Modal
            open={show}
            onClose={onClose}
            aria-labelledby="SummaryModalHeading"
        >
        <Modal.Content>
            <Heading spacing level="1" size="large" id="SummaryModalHeading">Oppsummering</Heading>
            <Accordion>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst("legeerklaering.om-barnet.tittel")}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">{tekst("legeerklaering.felles.navn.label")}</Heading>
                        <Ingress spacing>{data.barn.navn}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-barnet.ident.label")}</Heading>
                        <Ingress spacing>{data.barn.ident}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-barnet.foedselsdato.label")}</Heading>
                        <Ingress spacing>{data.barn.foedselsdato?.toDateString()}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst('legeerklaering.legens-vurdering.tittel')}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">{tekst("legeerklaering.legens-vurdering.label")}</Heading>
                        <Ingress spacing>{data.legensVurdering}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst("legeerklaering.diagnose.tittel")}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.diagnose.hoveddiagnose.label")}</Heading>
                        <Ingress spacing>{`${data.hoveddiagnose?.code} - ${data.hoveddiagnose?.text}`}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.diagnose.bidiagnoser.label")}</Heading>
                        <List>
                            {data.bidiagnoser.map(bidiagnose =>
                                <List.Item key={`listbidiag-${bidiagnose.code}`}>{bidiagnose.code} - {bidiagnose.text}</List.Item>
                            )}
                        </List>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst("legeerklaering.tilsyn-varighet.tittel")}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">Periode</Heading>
                        <Ingress
                            spacing>{`${data.tilsynPeriode.fra.toDateString()} - ${data.tilsynPeriode.til.toDateString()}`}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst("legeerklaering.innleggelse-varighet.tittel")}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">Periode</Heading>
                        <Ingress
                            spacing>{`${data.innleggelsesPeriode.fra.toDateString()} - ${data.innleggelsesPeriode.til.toDateString()}`}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst("legeerklaering.om-legen.tittel")}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">{tekst("legeerklaering.felles.navn.label")}</Heading>
                        <Ingress spacing>{data.lege.navn}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-legen.hrp-nummer.label")}</Heading>
                        <Ingress spacing>{data.lege.hrpNummer}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst("legeerklaering.om-sykehuset.tittel")}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">{tekst("legeerklaering.felles.navn.label")}</Heading>
                        <Ingress spacing>{data.sykehus.navn}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-sykehuset.tlf.label")}</Heading>
                        <Ingress spacing>{data.sykehus.telefon}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-sykehuset.gateadresse.label")}</Heading>
                        <Ingress spacing>{data.sykehus.adresse.gate}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-sykehuset.postnummer.label")}</Heading>
                        <Ingress spacing>{data.sykehus.adresse.postnummer}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-sykehuset.poststed.label")}</Heading>
                        <Ingress spacing>{data.sykehus.adresse.poststed}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </Modal.Content>
        </Modal>
    ) : null;
}

export default SummaryModal;