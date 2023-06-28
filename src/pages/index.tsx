import Layout from '@/app/components/layout';
import "@navikt/ds-css";
import { GuidePanel } from '@navikt/ds-react';

export default function IndexPage() {
    return (
        <Layout>
            <GuidePanel className="m-12">
                Her kan du registrere digitalt legeerklæring for pleiepenger sykt barn.
            </GuidePanel>
        </Layout>
    )
}
