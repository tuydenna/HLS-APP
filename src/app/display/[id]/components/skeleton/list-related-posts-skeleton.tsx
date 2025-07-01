import {Skeleton} from "@app/components/ui/skeleton";

export function ListRelatedPostsSkeleton () {
    return (
        <div className="flex flex-col grow pl-5">
            <div className="flex space-y-3">
                <Skeleton style={{height: "calc(10vh + 2rem)"}} className="w-[40%] rounded-xl" />
                <div className="flex flex-col ml-2 justify-around w-[60%]">
                    <div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-[20%] mb-1" />
                        <Skeleton className="h-4 w-[60%] mb-1" />
                        <Skeleton className="h-4 w-[40%]" />
                    </div>
                </div>
            </div>
            <div className="flex space-y-3">
                <Skeleton style={{height: "calc(10vh + 2rem)"}} className="w-[40%] rounded-xl" />
                <div className="flex flex-col ml-2 justify-around w-[60%]">
                    <div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-[20%] mb-1" />
                        <Skeleton className="h-4 w-[60%] mb-1" />
                        <Skeleton className="h-4 w-[40%]" />
                    </div>
                </div>
            </div>
            <div className="flex space-y-3">
                <Skeleton style={{height: "calc(10vh + 2rem)"}} className="w-[40%] rounded-xl" />
                <div className="flex flex-col ml-2 justify-around w-[60%]">
                    <div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-[20%] mb-1" />
                        <Skeleton className="h-4 w-[60%] mb-1" />
                        <Skeleton className="h-4 w-[40%]" />
                    </div>
                </div>
            </div>
            <div className="flex space-y-3">
                <Skeleton style={{height: "calc(10vh + 2rem)"}} className="w-[40%] rounded-xl" />
                <div className="flex flex-col ml-2 justify-around w-[60%]">
                    <div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-[20%] mb-1" />
                        <Skeleton className="h-4 w-[60%] mb-1" />
                        <Skeleton className="h-4 w-[40%]" />
                    </div>
                </div>
            </div>
            <div className="flex space-y-3">
                <Skeleton style={{height: "calc(10vh + 2rem)"}} className="w-[40%] rounded-xl" />
                <div className="flex flex-col ml-2 justify-around w-[60%]">
                    <div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-[20%] mb-1" />
                        <Skeleton className="h-4 w-[60%] mb-1" />
                        <Skeleton className="h-4 w-[40%]" />
                    </div>
                </div>
            </div>
            <div className="flex space-y-3">
                <Skeleton style={{height: "calc(10vh + 2rem)"}} className="w-[40%] rounded-xl" />
                <div className="flex flex-col ml-2 justify-around w-[60%]">
                    <div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-[20%] mb-1" />
                        <Skeleton className="h-4 w-[60%] mb-1" />
                        <Skeleton className="h-4 w-[40%]" />
                    </div>
                </div>
            </div>
        </div>
    )
}