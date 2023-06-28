import { NextAuthOptions } from 'next-auth';
import DipsProvider from '@/app/api/auth/dipsProvider';

const DIPS_CLIENT_ID = process.env.DIPS_CLIENT_ID as string;

export const authOptions: NextAuthOptions = {
    providers: [
        DipsProvider({
            clientId: DIPS_CLIENT_ID,
            clientSecret: process.env.DIPS_CLIENT_SECRET as string
        })
    ]
};
