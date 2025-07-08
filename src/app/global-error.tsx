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
        <div className="flex flex-col justify-center items-center fixed inset-1" >
            <p className="text-red-500 text-lg">Something went wrong!</p>
            <button className="cursor-pointer" onClick={() => reset()}>Try again</button>
        </div>
    )
}