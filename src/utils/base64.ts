
export const base64ToBlob = async (base64: string, contentType: string): Promise<Blob> => {
    const base64DataUrl = `data:${contentType};base64,${base64}`
    const result = await fetch(base64DataUrl)
    if(result.ok) {
        return await result.blob()
    } else {
        throw new Error(`Could not fetch data url for base64 decoding: ${result.statusText}`)
    }
}

export const blobToBase64 = async (blob: Blob): Promise<string> => {
    const base64Promise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if(typeof result === "string") {
                const [header, base64] = result.split(",")
                if(header.startsWith("data:") && header.endsWith(";base64")) {
                    resolve(base64);
                } else {
                    throw new Error(`Could not convert blob to base64 string. Invalid FileReader result. (${header.substring(0, 20)})`)
                }
            } else {
                throw new Error(`Could not convert blob to base64. FileReader result not a string (${typeof result})`)
            }
        };

        reader.readAsDataURL(blob);
        reader.onerror = reject;
    });
    return await base64Promise
}
