# K9 Legeerklæring on FHIR

## Start

### Forutsetninger

- [Node.js](https://nodejs.org/en/) >= 18.x.x
- [npm](https://www.npmjs.com/) >= 9.x.x
- @Navikt packages authenticated with GitHub
  Packages [Click here for guide](https://github.com/navikt/frontend#installere-pakker-lokalt)

### Miljøvariabler

Lag en `.env` fil i roten av prosjektet med følgende variabler:

- `FHIR_BASE_URL=https://api.dips.no/fhir`
- `FHIR_SUBSCRIPTION_KEY` (can be retrieved [OPEN DIPS Profile](https://open.dips.no/profile))
- `HELSEOPPLYSNINGER_SERVER_BASE_URL=https://helseserver.intern.dev.nav.no`
- `HELSEOPPLYSNINGER_SERVER_SCOPE=api://dev-gcp.helseopplysninger.server-helse/.default`
- `AZURE_APP_CLIENT_ID=k9-legeerklaering-on-fhir`
- `AZURE_APP_CLIENT_SECRET=some-secret`
- `AZURE_APP_WELL_KNOWN_URL=http://localhost:8080/default/.well-known/openid-configuration` (well-known URL for
  mocked Azure AD-containeren i docker-compose)

Hvis du vil utføre frontend-utvikling med en falsk helseopplysninger-backend i stedet for å måtte koble til en ekte
tjeneste må du sette `FAKE_HELSEOPPLYSNINGER=fake1` i `.env`-filen. Dette unngår behovet for å kjøre docker-compose med
mocked Azure AD-container.

### Installer avhengigheter

```bash
npm ci
 ```

### Kjør utviklingsserveren

```bash
npm run dev
```

Tjenesten vises på [http://localhost:3000](http://localhost:3000).

### Bygg med Docker

```bash
docker build -t k9-legeerklaering-on-fihr .
```

### Kjør docker image

```bash
docker run -p 8080:8080 k9-legeerklaering-on-fihr:latest
```

### Kjør med docker-compose

Kjør applikasjonen med docker-compose for å få med mock azure ad.

```bash
docker compose -f docker-compose.yaml up --build
```

## Løsningsbeskrivelse

Visualisert løsningsbeskrivelse som beskrevet
i [Implementasjonsguide SMART App Launch Framework](https://helsenorge.atlassian.net/wiki/spaces/HELSENORGE/pages/67469415/Implementasjonsguide+SMART+App+Launch+Framework)

```mermaid
sequenceDiagram
    box EPJ
        participant EPJ as EPJ
        participant Browser as Integrert Nettleser
        participant AuthServer as Autorisasjonsserver
        participant FHIR as FHIR API
    end
    box NAV
        participant App as k9-legeerklaering-on-fhir-klient
        participant AppBackend as k9-legeerklaering-on-fhir-server
    end

    EPJ ->> Browser: Start webapplikasjon med SMART App Launch Framework
    Browser ->> EPJ: Opprett LaunchContext (inkl. patient, practitioner, encounter)
    EPJ ->> Browser: Returner LaunchContext ID
    Browser ->> App: Initier launch-sekvens (iss, launch)
    App ->> AuthServer: Forespør /metadata/ eller .well-known/smart-configuration.json
    AuthServer ->> App: Returner URLs til authorize og token endepunkter
    App ->> AuthServer: Forespørsel mot authorize endepunkt med nødvendige parametere
    AuthServer ->> EPJ: Sjekk autorisasjon (lokale tilgangsregler, brukers samtykke)
    EPJ ->> AuthServer: Autorisasjonsavgjørelse
    AuthServer ->> App: Returner autorisasjonskode eller feilkode/-respons
    App ->> AuthServer: Veksle inn autorisasjonskoden for tilgangstoken
    AuthServer ->> App: Returner tilgangstoken (og potensielle andre tokens som id_token, refresh_token)

    critical FHIR API kall med api-key proxy
        App -->> AppBackend: Forespørsler for helsedata med tilgangstoken
        AppBackend -->> FHIR: Forespørsler for helsedata med tilgangstoken
        FHIR -->> AppBackend: Returner helsedata basert på token og forespørsel
        AppBackend -->> App: Returner helsedata basert på token og forespørsel
    end

    critical Direkte kall til FHIR API
        App ->> FHIR: Forespørsler for helsedata med tilgangstoken
        FHIR ->> App: Returner helsedata basert på token og forespørsel
    end
```

#### Forklaring av diagram

| Linje | Forklaring                                                                                                                                                                                                   |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ----- | Alle kall til FHIR API får en [api-nøkkel](src/app/api/fhir/proxy/[...api-path]/route.ts) som hentes og legges på via [k9-legeerklæring-on-fhir-_server_](src/integrations/fhir/ProxiedFhirClientWrapper.ts) |
| ___   | Alle kall går [direkte fra k9-legeerklæring-on-fhir-_client_ til FHIR API](src/integrations/fhir/FhirClientWrapper.ts)                                                                                       |
