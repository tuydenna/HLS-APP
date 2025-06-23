"use client"

import {useEffect, useState} from "react";
import {getPosts} from "../../../../../services/post-api";
import {IVideoPost} from "../../../../../types/video-post";
import {getImageURL} from "@util/helper";
import Link from "next/link";
import moment from "moment/moment";

export default function RightSideRelatedPosts( ) {

    const [posts, setPosts] = useState<IVideoPost[]>([]);

    useEffect(() => {
        getPosts().then(setPosts);
    }, []);

    return (
        <div className="flex flex-col grow pl-5">
            {
                posts.map((post: IVideoPost) => {
                    return (
                        <Link  href={`/display/${post.id}`} key={post.id}>
                            <div  className="flex w-full post-hover h-30 mb-4" style={{height: "calc(10vh + 2rem)"}}>
                                <div className={`flex-none w-[40%] rounded h-full bg-cover`} style={{backgroundImage: `url("${getImageURL(post.thumbnail)}")`}}></div>
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
                                            {post.views} views <sup className="font-bold ml-2"> . </sup> {moment(post.createdAt).fromNow()}
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

    )
}