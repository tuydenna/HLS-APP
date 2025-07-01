import {Skeleton} from "@app/components/ui/skeleton";

export function PostInfoSkeleton () {
    return (
        <>
            <div className="space-y-2 mb-5">
                <Skeleton className="h-4 w-[85%]" />
            </div>
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
            <div className="space-y-2 mt-5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[85%]" />
            </div>
            <div className="mt-5">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
                <div className="flex items-center space-x-4 mt-5">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
        </>
    )
}