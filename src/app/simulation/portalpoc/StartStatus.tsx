import { BaseApi } from "@/app/simulation/portalpoc/BaseApi";
import UserListing from "@/app/simulation/portalpoc/UserListing";
import { Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import HospitalListing from "@/app/simulation/portalpoc/HospitalListing";
import { ArrowsCirclepathIcon, HospitalIcon, PersonCircleIcon } from "@navikt/aksel-icons";
import InitDataDependentRender from "@/app/simulation/portalpoc/InitDataDependentRender";

const StartStatus = (baseApi: BaseApi) => {
        return (
            <InitDataDependentRender baseApi={baseApi} render={(initData) => (
                <VStack gap="4">
                    <HStack gap="4">
                        <Box background="bg-subtle" padding="4" borderRadius="medium">
                            <PersonCircleIcon style={{float: "left"}} fontSize="1.8rem" />
                            <Heading spacing level="3" size="small">Bruker</Heading>
                            <UserListing user={initData.practitioner} />
                        </Box>
                        <Box background="bg-subtle" padding="4" borderRadius="medium" borderColor="border-strong">
                            <Heading spacing level="3" size="small">
                                <HospitalIcon style={{float: "left"}} aria-hidden fontSize="1.8rem" />
                                Sykehus</Heading>
                            <HospitalListing hospital={initData.hospital} />
                        </Box>
                    </HStack>
                    <Box>
                        Hvis noe av info ovenfor ikke er korrekt bør du få rettet det i journalsystemet ditt, og så
                        <Button
                            onClick={baseApi.refreshInitData}
                            disabled={baseApi.loading !== false}
                            variant="tertiary-neutral"
                            size="small">
                            oppfriske <ArrowsCirclepathIcon style={{display: "inline"}} />
                        </Button>
                        dette vinduet.
                    </Box>
                </VStack>
            )} />
        )
}

export default StartStatus;