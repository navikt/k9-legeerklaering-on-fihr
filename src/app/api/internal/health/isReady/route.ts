import { NextResponse } from "next/server";
import { getServerEnv } from '@/utils/env';
import { getClient } from '@/auth/azure/getServerHelseToken';

export const GET = async (): Promise<NextResponse> => {
    try {
        getServerEnv();
        await getClient();
    } catch (error) {
        return NextResponse.json({}, {status: 500});
    }
    return NextResponse.json({message: 'success'});
}
