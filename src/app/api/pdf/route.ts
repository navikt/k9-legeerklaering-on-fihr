import { NextRequest, NextResponse } from 'next/server';
import { logRequest } from '@/utils/loggerUtils';
import { logger } from '@navikt/next-logger';
import { FakeHelseopplysningerApi1 } from "@/app/simulation/fakeHelseopplysningerApi1";
import HelseopplysningerClient from "@/integrations/helseopplysningerserver/HelseopplysningerClient";
import { PSBLegeerklæringInnsending } from "@/integrations/helseopplysningerserver/types/HelseopplysningerTypes";
import { FhirSession } from "@/auth/fhir/FhirSession";
import { JwtVerificationInput } from "@/auth/fhir/JwtVerificationInput";
import { legeerklaeringDokumentSchema } from "@/app/components/legeerklaering/legeerklaeringDokumentSchema";
import {
    mapTilPSBLegeerklæringInnsending
} from "@/integrations/helseopplysningerserver/types/mapTilPSBLegeerklæringInnsending";
import { ValidationError } from "yup";

const initHelseopplysningerApi = () => process.env.FAKE_HELSEOPPLYSNINGER === "fake1" ?
    new FakeHelseopplysningerApi1() :
    new HelseopplysningerClient()

export const POST = async (request: NextRequest): Promise<Response> => {
    logRequest(request);
    // Check that requestor has a valid fhir session
    const authHeader = request.headers.get("Authorization") || ""
    const fhirSession = await FhirSession.fromVerifiedJWT(JwtVerificationInput.fromAuthorizationHeader(authHeader))
    logger.info("genererer legeerklæring pdf...");
    // Valider innsendte skjemadata
    const requestJson = await request.json()
    try {
        const legeerklæringDokument = await legeerklaeringDokumentSchema.validate(requestJson)
        const innsending = mapTilPSBLegeerklæringInnsending(legeerklæringDokument)
        // Check that hpr-number of session equals posted document
        if(innsending.lege.hpr === fhirSession.hprNumber) {
            // XXX Her kunne vi evt ha validering av nokre innsendte skjemaopplysninger opp mot fhir api, før registrering av
            // data i NAV sine system. Feks at lege sitt namn er korrekt, spesialiststatus, pasient-namn, etc.
            const helseopplysningerApi = initHelseopplysningerApi()
            const pdfBlob = await helseopplysningerApi.generatePdf(innsending)
            return new Response(pdfBlob)

        } else {
            return new NextResponse(`fhir session hpr-nummer ulikt legeerklæring (${fhirSession.hprNumber} != ${innsending.lege.hpr})`, {status: 400})
        }
    } catch(e) {
        if(e instanceof ValidationError) {
            return new NextResponse(`${e.message}`, {status: 400})
        } else {
            throw e
        }
    }
}
