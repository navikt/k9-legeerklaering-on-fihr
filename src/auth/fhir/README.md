FHIR session verification
=========================

The `FhirSession` class and associated code in this directory is used to verify that information posted to the frontend 
server comes from the user id it claims to come, and from the system (issuer) it claims to come from.

This is done by initializing an instance of the `FhirSession` like the code block below demonstrates.
```typescript
const authHeader = request.headers.get("Authorization") || ""
const session = await FhirSession.fromVerifiedJWT(JwtVerificationInput.fromAuthorizationHeader(authHeader))
```

The `JwtVerificationInput.fromAuthorizationHeader` method first processes the JWT authorization token to resolve a trusted 
public key that will be used to validate the session. In detail, it performs these steps:

1. Decode the request JWT, without validating it.
2. Check that the claimed issuer is one we've defined as valid.
3. Resolve the "well-known" URL for downloading the claimed issuer public key (`jwksUrl` method).
4. Create a JWK set "fetcher" that will download the public key for validation when needed.
5. Return a `JwtVerificationInput` with the auth token string and the public key fetcher, ready to be used for verification.

The `FhirSession.fromAuthorizationHeader` then performs the desired verification of the auth token. It cryptographically
verifies that the 'issuer' claim and 'hpr-nummer' claim is correct, that the auth token was made for our client_id, and 
returns a new class instance with the 'issuer' and 'hpr-nummer' properties set.

If the incoming auth token cannot be verified, or does not have the required information, an error is thrown.
