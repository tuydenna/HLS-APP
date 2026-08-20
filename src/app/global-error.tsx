'use client'

import {useRouter} from 'next/navigation';
import {onDidUpdate} from "@lib/react-adapter";

export default function GlobalError({error, reset}: { error: Error, reset: () => void }) {
    const router = useRouter();

    onDidUpdate(() => {
        // Log the error to an error reporting services
        console.error("GlobalError", error);
        console.log("GlobalError", error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            alert("Unauthorized");
            return router.push('/auth/login');
        }
    }, [error])

    return (
        <div className="flex flex-col justify-center items-center fixed inset-1" >
            <p className="text-red-500 text-lg">Something went wrong!</p>
            <button className="cursor-pointer" onClick={() => reset()}>Try again</button>
        </div>
    )
}