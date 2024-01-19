import React, { useEffect, useRef, useState } from "react";

export interface PdfIframeProps {
    readonly pdf: Blob;
    readonly width: string;
    readonly height: string;
}

const PdfIframe = ({pdf, width, height}: PdfIframeProps) => {
    const objectUrl = useRef<string | undefined>()

    useEffect(() => {
        const prevObjectUrl = objectUrl.current
        const newObjectUrl = URL.createObjectURL(pdf)
        objectUrl.current = newObjectUrl
        if(prevObjectUrl !== undefined) { // cleanup previous objecturl before creating new
            URL.revokeObjectURL(prevObjectUrl)
        }
        return () => { // cleanup when component is unmounted
            URL.revokeObjectURL(newObjectUrl)
        }
    }, [pdf]);

    return <iframe src={objectUrl.current} width={width} height={height} />
}

export default PdfIframe