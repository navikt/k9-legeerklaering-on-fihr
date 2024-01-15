'use server'
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";

/**
 * This is just for faking a generated pdf during dev/test.
 * Must never be used in production.
 */
export const fakePdf = async (): Promise<Blob> => {
    const path = resolve('./src/app/simulation/fake-generated.pdf')
    const content = await readFile(path)
    return new Blob([content], {type: "application/pdf"})
}