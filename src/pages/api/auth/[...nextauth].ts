import NextAuth, { AuthOptions } from 'next-auth'
import DipsProvider from '@/pages/api/auth/dipsProvider';

const DIPS_CLIENT_ID = process.env.DIPS_CLIENT_ID as string;
export default NextAuth({

    providers: [
        DipsProvider({
            clientId: DIPS_CLIENT_ID,
            clientSecret: process.env.DIPS_CLIENT_SECRET as string
        })
    ]
} as AuthOptions)
