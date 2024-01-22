'use client';
import React, { useEffect } from "react";

export interface PdfIframeProps {
    readonly pdf: Blob;
    readonly width: string;
    readonly height: string;
}

const PdfIframe = ({pdf, width, height}: PdfIframeProps) => {
    const objectUrl = URL.createObjectURL(pdf)

    // Use effect to get cleanup of created object url when component is unmounted, to reclaim memory
    useEffect(() => {
        return () => { // unmount callback
            URL.revokeObjectURL(objectUrl)
        }
    }, [objectUrl]);

    return <iframe src={objectUrl} width={width} height={height} />
}

export default PdfIframe