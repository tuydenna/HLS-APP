"use client"

import {IVideoPost} from "@interfaces/video-post";
import { AvatarUI} from "@app/components/ui/avatar";
import {CardDescription, CardTitle} from "@app/components/ui/card";
import {Button} from "@app/components/ui/button";
import {Heart} from "lucide-react";
import React, {useState} from "react";
import {getImageURL} from "@util/helper";
import PostService from "@services/post-service";
import {IUser} from "@interfaces/user";
import {formatViewCount} from "@util/video-config";

export default function VideoAuthor ({post, auth}: {post: IVideoPost, auth: IUser}) {
    const [isLiked, setIsLiked] = useState(getIsLikedInit(post));
    const [likeCount, setLikeCount] = useState(post.likes);

    async function onToggleLike() {
        const resPost: IVideoPost = await new PostService()[isLiked ? "dislikePost" : "likePost"](post.id, auth.id);
        setLikeCount(resPost.likes);
        setIsLiked(!isLiked);
    }

    function getIsLikedInit(post: IVideoPost): boolean {
        return !!(post.likePosts.length && post.likePosts[0].like)
    }

    return (
        <div className="flex md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
               <AvatarUI src={getImageURL(post.author.avatar)} fallbackName={post.author.name} widthClass="w-15 md:w-17" heightClass="h-15 md:h-17"/>
                <div>
                    <CardTitle className="text-sm md:text-xl">{post.author?.name}</CardTitle>
                    <CardDescription>1.2M Subscribers</CardDescription>
                </div>
            </div>
            <div className="flex grow justify-end md:items-end space-x-4 md:space-x-8 pt-2.5">
                <div className="flex flex-col">
                    <span onClick={onToggleLike} className={`text-sm md:text-lg ${isLiked ? "text-blue-400" : "text-muted-foreground"}  font-bold  hover:scale-110 cursor-pointer`}>Likes</span>
                    <span className="text-center text-sm text-muted-foreground md:text-lg md:font-bold ">{formatViewCount(likeCount)}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm md:text-lg text-muted-foreground font-bold">Views</span>
                    <span className="text-center text-sm text-muted-foreground md:text-lg md:font-bold ">{formatViewCount(post.views)}</span>
                </div>
            </div>
        </div>
    )
}


