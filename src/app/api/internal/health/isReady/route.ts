import { NextResponse } from "next/server";
import { getServerEnv } from '@/utils/env';
import AzureClientConfiguration from '@/auth/azure/AzureClientConfiguration';

export const GET = async (): Promise<NextResponse> => {
    try {
        getServerEnv();
        await AzureClientConfiguration.getClient();
    } catch (error) {
        return NextResponse.json({}, {status: 500});
    }
    return NextResponse.json({message: 'success'});
}
