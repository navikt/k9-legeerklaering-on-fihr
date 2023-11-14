
import css from "./LabeledLines.module.css";
import { Label } from "@navikt/ds-react";
import React from "react";

export interface LabeledLine {
    readonly label: string;
    readonly value: string | React.ReactNode;
}

export interface LabeledLinesProps {
    readonly lines: LabeledLine[];
}

const LabeledLines = ({lines}: LabeledLinesProps) => {
    return <div className={css.listing}>
        {
            lines.map((l, i) => {
                // the outer div wrapper is just for react key needs, so it has display: contents
                return (
                    <div key={i} style={{display: "contents"}}>
                        <Label className={css.right}>{l.label}</Label>
                        <div>{l.value}</div>
                    </div>
                )
            })
        }
    </div>
}

export default LabeledLines;