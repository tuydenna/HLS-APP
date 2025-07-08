import Link from "next/link";
import Image from "next/image";
import {IVideoPost} from "@interfaces/video-post";
import {getImageURL, timeAgo} from "@util/helper";
import PostService from "@services/postv2-api";
import {getCookieAuthHeader} from "@lib/next-adapter";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@components/ui/card";
import {AvatarUI} from "@components/ui/avatar";
import React from "react";
import HomeListPostsSkeleton from "@components/skeleton/home-list-posts-skeleton";
import ImageLoaderWrapper from "@app/home/ImageLoaderWrapper";

export default async function Content() {

    const posts: IVideoPost[] = await new PostService().setHeaders(await getCookieAuthHeader()).getMany();
    return (
        posts.length ?
            <div className="m-5 w-[80%]">
                <ImageLoaderWrapper fallBack={<HomeListPostsSkeleton/>}>
                    <div className={"flex flex-wrap"}>
                        {
                            posts?.map((post: IVideoPost) => {
                                return (
                                    <Card className="w-full max-w-sm m-[1vw] gap-2" key={post.id}>
                                        <CardHeader>
                                            <Link href={`/watch/${post.id}`} className="aspect-video">
                                                <Image className="w-full h-full object-cover"
                                                       src={getImageURL(post.thumbnail)}
                                                       alt={''} width={200} height={100} priority={true}/>
                                            </Link>
                                        </CardHeader>
                                        <CardFooter className="flex-col gap-2">
                                            <div className="flex items-center space-x-1 mb-6 md:mb-0 w-full">
                                                <AvatarUI src={getImageURL(post.author.avatar)} fallbackName={post.author.name}/>
                                                <div>
                                                    <CardTitle className="text-sm line-clamp-2">{post.title}</CardTitle>
                                                    <CardDescription>{post.author.name}</CardDescription>
                                                    <CardDescription>{post.views} Views • {timeAgo(post.createdAt)}</CardDescription>
                                                </div>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </ImageLoaderWrapper>
            </div>
            :
        <div className="flex justify-center items-center w-full">
            No content ...
        </div>
    )
}