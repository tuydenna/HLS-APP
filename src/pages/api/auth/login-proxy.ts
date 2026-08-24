import type { NextApiRequest, NextApiResponse } from "next";
import {parseSetCookie, SetCookie, stringifySetCookie} from "cookie";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/authentications/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        }
    );

    const respondData: {data: any, message: string} = await response.json();
    if (!response.ok) {
        return res.status(response.status).json(respondData);
    }
    console.log("login proxy", respondData,  process.env.NODE_ENV,  parseSetCookie(response.headers.getSetCookie()?.at(0) || ""));

    const apiCookie: SetCookie = parseSetCookie(response.headers.getSetCookie()?.at(0) || "") || {};
    apiCookie.sameSite =  "strict";
    apiCookie.sameSite =  process.env.NODE_ENV === "production";

    res.setHeader("Set-Cookie", stringifySetCookie(apiCookie));
    return res.status(200).json(respondData);
}