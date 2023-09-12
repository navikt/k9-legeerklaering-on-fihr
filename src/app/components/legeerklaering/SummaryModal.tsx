import {Accordion, Heading, Ingress, List, Modal} from "@navikt/ds-react";
import {tekst} from "@/utils/tekster";
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
                        <Ingress spacing>{data.barn.name}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-barnet.ident.label")}</Heading>
                        <Ingress spacing>{data.barn.identifier}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-barnet.foedselsdato.label")}</Heading>
                        <Ingress spacing>{data.barn.birthDate?.toDateString()}</Ingress>
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
                        <Heading level="5" size="xsmall">Perioder</Heading>
                        <List>
                            {
                                data.tilsynPerioder.map(tilsynsPeriode =>
                                    <List.Item key={`tilsynp-${tilsynsPeriode.start?.getTime()}-${tilsynsPeriode.end?.getTime()}`}>
                                        {tilsynsPeriode.start?.toLocaleDateString('no-NO')} - {tilsynsPeriode.end?.toLocaleDateString('no-NO')}
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
                                    <List.Item key={`innleggp-${innleggelsesPeriode.start?.getTime()}-${innleggelsesPeriode.end?.getTime()}`}>
                                        {innleggelsesPeriode.start?.toLocaleDateString('no-NO')} - {innleggelsesPeriode.end?.toLocaleDateString('no-NO')}
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
                        <Ingress spacing>{data.lege.name}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-legen.hpr-nummer.label")}</Heading>
                        <Ingress spacing>{data.lege.hprNumber}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>{tekst("legeerklaering.om-sykehuset.tittel")}</Accordion.Header>
                    <Accordion.Content>
                        <Heading level="5" size="xsmall">{tekst("legeerklaering.felles.navn.label")}</Heading>
                        <Ingress spacing>{data.sykehus.name}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-sykehuset.tlf.label")}</Heading>
                        <Ingress spacing>{data.sykehus.phoneNumber}</Ingress>

                        <Heading level="5" size="xsmall">
                            {tekst("legeerklaering.om-sykehuset.gateadresse.label")}
                        </Heading>
                        <Ingress spacing>{data.sykehus.address?.line1}</Ingress>
                        <Ingress spacing>{data.sykehus.address?.line2}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-sykehuset.postnummer.label")}</Heading>
                        <Ingress spacing>{data.sykehus.address?.postalCode}</Ingress>

                        <Heading level="5"
                                 size="xsmall">{tekst("legeerklaering.om-sykehuset.poststed.label")}</Heading>
                        <Ingress spacing>{data.sykehus.address?.city}</Ingress>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </Modal.Content>
        </Modal>
    ) : null;
}

export default SummaryModal;