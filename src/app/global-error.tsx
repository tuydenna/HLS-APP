'use client'

import {useRouter} from 'next/navigation';
import {onDidUpdate} from "@lib/react-adapter";

export default function GlobalError({error, reset}: { error: Error, reset: () => void }) {
    const router = useRouter();



    onDidUpdate(() => {
        // Log the error to an error reporting service
        console.error(error);
        console.log(error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            // return router.push('/auth/register');
        }
    }, [error])

    return (
        <html>
        <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
        </body>
        </html>
    )
}