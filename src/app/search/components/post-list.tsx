"use client"
import React, {RefObject, useRef, useState} from "react";
import Link from "next/link";
import Image from "@components/optimize/image";
import {IVideoPost} from "@interfaces/video-post";
import {getImageProxyAPI, getImageURL, timeAgo} from "@util/helper";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@components/ui/card";
import {AvatarUI} from "@components/ui/avatar";
import { onDidUpdate} from "@lib/react-adapter";
import SearchService from "@services/search-service";
import {LoaderSpinner} from "@components/ui/loader-spinner";
import { useParams } from 'next/navigation';

export default function PostList({posts}: {posts: IVideoPost[]}) {
    const [postList, setPostList] = useState(posts.filter(Boolean));
    const defaultTake: number = 10;
    const isLoadingMoreRef: RefObject<boolean> = useRef(false);
    const isNoMorePost: RefObject<boolean> = useRef(posts.length < defaultTake );
    const params: {searchKey: string} | null  = useParams<{searchKey: string}>();

    onDidUpdate(() => {
        async function loadMorePosts() {
            const skip: number = postList.length + defaultTake - 1;
            const posts: IVideoPost[] = await new SearchService().searchPosts(params?.searchKey, defaultTake, skip);
            if (posts.length < defaultTake) {
                isLoadingMoreRef.current = true;
            }
            isLoadingMoreRef.current = false;
            setPostList([...postList, ...posts].filter(Boolean));
        }
        async function onScroll() {
            const nearBottom: boolean = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
            if (nearBottom && !isLoadingMoreRef.current && !isNoMorePost.current) {
                isLoadingMoreRef.current = true;
                await loadMorePosts();
            }
        }

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [postList])

    return (
        <>
            <div className={"flex flex-col md:flex-row md:flex-wrap gap-2 m-3 md:m-0"}>
                {
                    postList.length ? postList?.map((post: IVideoPost) => (
                        <Card className="w-full md:max-w-sm md:m-[1vw] gap-2" key={post.id}>
                            <CardHeader>
                                <Link href={`/watch/${post.id}`} className="aspect-video">
                                    <Image className="w-full h-full object-cover"
                                           src={getImageProxyAPI(getImageURL(post.thumbnail))}
                                           alt={process.env.NEXT_PUBLIC_APP_NAME} width={200} height={100} priority="true" />
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
                    )
                    :
                    <div className="flex justify-center items-center w-full">
                        No content ...
                    </div>
                }
            </div>
            <div className={`flex justify-center m-5  transition-all transition-discrete ${isLoadingMoreRef ? "hidden" : "block"}`}>
                <LoaderSpinner className="h-5 w-5 text-indigo-600"/>
                <p className="pl-1">Loading ...</p>
            </div>
        </>
    )
}