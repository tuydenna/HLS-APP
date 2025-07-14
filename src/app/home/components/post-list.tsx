"use client"
import React, {RefObject, useRef, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {IVideoPost} from "@interfaces/video-post";
import {getImageURL, timeAgo} from "@util/helper";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@components/ui/card";
import {AvatarUI} from "@components/ui/avatar";
import { onDidUpdate} from "@lib/react-adapter";
import SearchService from "@services/search-service";

export default function PostList({posts}: {posts: IVideoPost[]}) {
    const [postList, setPostList] = useState(posts);
    const defaultTake: number = 10;
    const isLoadingMoreRef: RefObject<boolean> = useRef(false);
    const isNoMorePost: RefObject<boolean> = useRef(false);

    onDidUpdate(() => {
        async function loadMorePosts() {
            const skip: number = postList.length + defaultTake - 1;
            const posts: IVideoPost[] = await new SearchService().searchPosts("", defaultTake, skip);
            if (posts.length < defaultTake) {
                isLoadingMoreRef.current = true;
            }
            isLoadingMoreRef.current = false;
            setPostList([...postList, ...posts]);
        }
        async function onScroll() {
            const nearBottom: boolean = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
            if (nearBottom && !isLoadingMoreRef.current && !isNoMorePost.current) {
                console.log("loading more posts");
                isLoadingMoreRef.current = true;
                await loadMorePosts();
            }
        }

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [postList])

    return (
        <div className={"flex flex-wrap"}>
            {
                postList?.map((post: IVideoPost) => {
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
    )
}