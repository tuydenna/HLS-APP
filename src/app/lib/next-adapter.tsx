import {cookies} from "next/headers";

export async function getAuthToken(): Promise<string> {
    return (await cookies()).get("auth_token")?.value || "";
}

export async function getCookieAuthHeader(token?: string): Promise<HeadersInit> {
    return {Cookie: `auth_token=${token ?? await getAuthToken()}`}
}