
// A simple marker type for a JWT issuer to avoid mixup
export type Issuer = `https://${string}.${string}`;

// Some basic validation
export const isIssuer = (str?: string): str is Issuer =>
    str !== undefined &&
    str.startsWith("https://") &&   // all issuer urls must start with https://
    str.indexOf(".") > 8 &&         // must be a dot somewhere in a valid domain
    !str.endsWith("/")              // must not end with a slash
