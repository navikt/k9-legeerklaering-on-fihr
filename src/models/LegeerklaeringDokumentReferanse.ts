export const LegeerklaeringDokumentReferansePrefiks = `NAV-DOCREF-`

/**
 * Vi ønsker at dokument referansen skal vere ein unik tekst som alltid started med "NAV-DOCREF-", og deretter to
 * tilfeldige hexadesimale tal på fire karakterer kvar.
 */
export type LegeerklaeringDokumentReferanse = `${typeof LegeerklaeringDokumentReferansePrefiks}${string}-${string}`

export const isLegeerklaeringDokumentReferanse = (str: string): str is LegeerklaeringDokumentReferanse =>
    str.startsWith(LegeerklaeringDokumentReferansePrefiks)

const toHex = (n: number): string => n.toString(16)

// Create a random number in the hexadecimal interval of 0 to ffffffff (eight characters)
const makeRandomNum = (): number => Math.floor(Math.random() * 0xffffffff)

// Ensure that string length of generated hex number is always 8
const padTo8 = (str: string) => str.padStart(8, "0")

/**
 * Oppretter ein ny tilfeldig dokument referanse verdi for bruk ved oppretting av ny legeerklæring.
 * Det tilfeldige talet vil vere mellom 0 og ca 4,2 milliarder. Reknar med dette er nok tilfeldighet for bruksområdet.
 */
export const randomLegeerklaeringDokumentReferanse = (): LegeerklaeringDokumentReferanse => {
    const randomHex = padTo8(toHex(makeRandomNum()))
    // Splitt hex talet i to slik at det blir lettare å lese og skrive.
    const part1 = randomHex.substring(0, 4)
    const part2 = randomHex.substring(4)
    return `${LegeerklaeringDokumentReferansePrefiks}${part1}-${part2}`
}