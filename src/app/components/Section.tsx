import React, { ReactNode } from 'react';
import { Heading, HelpText, Panel } from '@navikt/ds-react';

interface SectionProps {
    title: string;
    helpText?: string;
    children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, helpText, children }) => {
    return (
        <Panel className="mb-4">
            <div className="flex items-center space-x-4 mb-4">
                <Heading size={'medium'} className="mb-4" level="2">{title}</Heading>
                {helpText && <HelpText title={title}>{helpText}</HelpText>}
            </div>
            {children}
        </Panel>
    );
}

export default Section;
