"use client"

import {useState} from "react";
import {IVideoPost} from "@interfaces/video-post";
import {getImageURL, timeAgo} from "@util/helper";
import Link from "next/link";
import {onDidMount} from "@lib/react-adapter";
import PostService from "@services/post-service";
import {
    ListRelatedPostsSkeleton,
} from "@components/skeleton/list-related-posts-skeleton";
import {Card} from "@components/ui/card";

export default function ListRelatedPosts() {

    const [posts, setPosts] = useState<IVideoPost[]>([]);

    onDidMount(function () {
        new PostService().getMany().then(setPosts);
    })

    return (
        posts.length ?
            <Card className="gap-1 p-3 mt-2 md:mt-0 md:ml-5 md:grow h-fit">
                <div className="flex flex-col">
                    {
                        posts.map((post: IVideoPost) => {
                            return (
                                <Link href={`/watch/${post.id}`} key={post.id}>
                                    <div className="flex w-full h-30 mb-4 hover:bg-[#0000000a] active:bg-[#0000000a]" style={{height: "calc(10vh + 2rem)"}} >
                                        <div className={`flex-none w-[40%] rounded h-full bg-cover`}
                                             style={{backgroundImage: `url("${getImageURL(post.thumbnail)}")`}}></div>
                                        <div className="grow ml-3">
                                            <div className="h-[50%]">
                                                <p className="text-lg line-clamp-2">
                                                    {post.title}
                                                </p>
                                            </div>
                                            <div className="grow text-gray-500 pt-1">
                                                <div className="text-sm line-clamp-1">
                                                    {post.author.name}
                                                </div>
                                                <div className="text-xs line-clamp-1">
                                                    {post.views} views <sup
                                                    className="font-bold ml-2"> . </sup> {timeAgo(post.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                    <div className="text-center cursor-pointer text-gray-500 p-2">Load more ...</div>
                </div>
            </Card>
        :
            <ListRelatedPostsSkeleton/>
    )
}