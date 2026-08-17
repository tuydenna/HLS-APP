// pages/api/image-proxy.js
import {Readable} from 'stream';
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url: string = req.query.url as string;

    if (!url) {
        return res.status(400).json({error: 'URL is required'});
    }

    try {
        const externalResponse: Response = await fetch(url, {
            headers: {
                // Manually forward the cookies from the user's request
                Cookie: req.headers.cookie || '',
            },
        });

        if (!externalResponse.ok) {
            throw new Error(`Failed to fetch image: ${externalResponse.statusText}`);
        }

        // Set content headers from the external response
        res.setHeader('Content-Type', externalResponse.headers.get('Content-Type')!);
        res.setHeader('Content-Length', externalResponse.headers.get('Content-Length')!);

        // Pipe the image data directly to the client
        // @ts-ignore
        const bodyStream: Readable = Readable.from(externalResponse.body);
        bodyStream.pipe(res);

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}