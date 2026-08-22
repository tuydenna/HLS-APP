import type { NextApiRequest, NextApiResponse } from "next";
import {stringifySetCookie} from "cookie";

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
    console.log(response.headers.getSetCookie());
    console.log("login proxy", respondData,  process.env.NODE_ENV);
    res.setHeader(
        "Set-Cookie",
         stringifySetCookie( {
             name: "auth_token",
             value: respondData.data.token,
             httpOnly: true,
             secure:  process.env.NODE_ENV === "production",
             sameSite: "strict",
             path: "/",
             maxAge: 60 * 60 * 24 * 7,
         })
    );

    return res.status(200).json(respondData);
}