import { Accordion, Heading, Ingress, List, Modal } from "@navikt/ds-react";
import { tekst } from "@/utils/tekster";
import React from "react";
import LegeerklaeringData from "@/app/components/legeerklaering/LegeerklaeringData";

export interface SummaryModalProps {
    readonly show: boolean;
    readonly onClose: () => void;
    readonly data: LegeerklaeringData | null;
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
                        <Ingress spacing>{data.pasient.navn.fornavn} {data.pasient.navn.etternavn}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-barnet.fnr.label")}</Heading>
                        <Ingress spacing>{data.pasient.fnr}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-barnet.foedselsdato.label")}</Heading>
                        <Ingress spacing>{data.pasient.fødselsdato?.toDateString()}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst('legeerklaering.vurdering.tittel')}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">{tekst("legeerklaering.vurdering.label")}</Heading>
                        <Ingress spacing>{data.vurdering}</Ingress>
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
                        <Heading level="5" size="xsmall">Perioder</Heading>
                        <List>
                            {
                                data.tilsynsPerioder.map(tilsynsPeriode =>
                                    <List.Item key={`tilsynp-${tilsynsPeriode.fom?.getTime()}-${tilsynsPeriode.tom?.getTime()}`}>
                                        {tilsynsPeriode.fom?.toLocaleDateString('no-NO')} - {tilsynsPeriode.tom?.toLocaleDateString('no-NO')}
                                    </List.Item>
                                )
                            }
                        </List>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst("legeerklaering.innleggelse-varighet.tittel")}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">Perioder</Heading>
                        <List>
                            {
                                data.innleggelsesPerioder.map(innleggelsesPeriode =>
                                    <List.Item key={`innleggp-${innleggelsesPeriode.fom?.getTime()}-${innleggelsesPeriode.tom?.getTime()}`}>
                                        {innleggelsesPeriode.fom?.toLocaleDateString('no-NO')} - {innleggelsesPeriode.tom?.toLocaleDateString('no-NO')}
                                    </List.Item>
                                )
                            }
                        </List>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst("legeerklaering.om-legen.tittel")}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">{tekst("legeerklaering.felles.navn.label")}</Heading>
                        <Ingress spacing>{data.lege.navn.fornavn} {data.lege.navn.etternavn}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-legen.hpr.label")}</Heading>
                        <Ingress spacing>{data.lege.hpr}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst("legeerklaering.om-sykehuset.tittel")}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">{tekst("legeerklaering.felles.navn.label")}</Heading>
                        <Ingress spacing>{data.sykehus.navn}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-sykehuset.tlf.label")}</Heading>
                        <Ingress spacing>{data.sykehus.tlf}</Ingress>

                        <Heading level="5" size="xsmall">
                            {tekst("legeerklaering.om-sykehuset.gateadresse.label")}
                        </Heading>
                        <Ingress spacing>{data.sykehus.adresse?.gateadresse}</Ingress>
                        <Ingress spacing>{data.sykehus.adresse?.gateadresse2}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-sykehuset.postkode.label")}</Heading>
                        <Ingress spacing>{data.sykehus.adresse?.postkode}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-sykehuset.by.label")}</Heading>
                        <Ingress spacing>{data.sykehus.adresse?.by}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </Modal.Content>
        </Modal>
    ) : null;
}

export default SummaryModal;
