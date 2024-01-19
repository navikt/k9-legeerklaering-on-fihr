import { readFile } from "node:fs/promises";
import { base64ToBlob, blobToBase64 } from "@/utils/base64";
import { resolve } from "node:path";

describe('base64', () => {
    test('encoding and decoding a pdf file should end up with result equal input', async () => {
        const inputPath = resolve("src/app/simulation/fake-generated.pdf")
        const inputFile = await readFile(inputPath)
        const inputBlob = new Blob([inputFile], {type: "application/pdf"})
        const base64Encoded = await blobToBase64(inputBlob)
        const decodedBlob = await base64ToBlob(base64Encoded, inputBlob.type)
        expect(decodedBlob).toEqual(inputBlob)
    })
})