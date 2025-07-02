import {Card, CardHeader} from "@components/ui/card";
import {Skeleton} from "@components/ui/skeleton";
import React from "react";

export default function HomeListPostsSkeleton() {
    return (
        <>
            <Card className="w-full max-w-sm m-[1vw] gap-2" >
                <CardHeader>
                    <div className="flex flex-col space-y-3">
                        <Skeleton className="h-[180px] w-full rounded-xl" />
                        <div className="flex items-center space-x-4 flex-1">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 grow">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[80%]" />
                                <Skeleton className="h-4 w-[60%]" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Card className="w-full max-w-sm m-[1vw] gap-2" >
                <CardHeader>
                    <div className="flex flex-col space-y-3">
                        <Skeleton className="h-[180px] w-full rounded-xl" />
                        <div className="flex items-center space-x-4 flex-1">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 grow">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[80%]" />
                                <Skeleton className="h-4 w-[60%]" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Card className="w-full max-w-sm m-[1vw] gap-2" >
                <CardHeader>
                    <div className="flex flex-col space-y-3">
                        <Skeleton className="h-[180px] w-full rounded-xl" />
                        <div className="flex items-center space-x-4 flex-1">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 grow">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[80%]" />
                                <Skeleton className="h-4 w-[60%]" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </>
    )
}