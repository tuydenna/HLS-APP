import {cookies} from "next/headers";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function getAuthToken(): Promise<string> {
    return (await cookies()).get("auth_token")?.value || "";
}

export async function getCookieAuthHeader(token?: string): Promise<HeadersInit> {
    return {Cookie: `auth_token=${token ?? await getAuthToken()}`}
}

