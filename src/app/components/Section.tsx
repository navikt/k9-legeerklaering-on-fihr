import React, { ReactNode } from 'react';
import { Heading, HStack, ReadMore, VStack } from '@navikt/ds-react';
import { componentSize } from '@/utils/constants';

interface SectionProps {
    title: string;
    readMoreHeader?: string;
    readMore?: string;
    children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, readMoreHeader, readMore, children }) => {
    return (
        <VStack className="mt-4" gap="4">
            <HStack gap="2" justify="start" align="start">
                <Heading size={'small'} className="mb-4">{title}</Heading>
            </HStack>
            <HStack>
                {readMore && <ReadMore size={componentSize} header={readMoreHeader}>{readMore}</ReadMore>}
            </HStack>
            {children}
        </VStack>
    );
}

export default Section;
