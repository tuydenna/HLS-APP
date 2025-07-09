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
        <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
               <AvatarUI src={getImageURL(post.author.avatar)} fallbackName={post.author.name} widthClass="w-17" heightClass="h-17"/>
                <div>
                    <CardTitle className="text-xl">{post.author?.name}</CardTitle>
                    <CardDescription>1.2M Subscribers</CardDescription>
                </div>
            </div>
            <div className="flex items-end space-x-8">
                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full group transition-transform transform hover:scale-110"
                        onClick={onToggleLike}
                    >
                        <Heart className={"h-7 w-7 transition-colors " + (isLiked ? 'text-red-500 fill-red-500' : 'text-muted-foreground group-hover:text-red-400')} />
                    </Button>
                    <p className="text-lg font-semibold mt-1">{formatViewCount(likeCount)}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-muted-foreground h-12 flex items-center">Views</p>
                    <p className="text-lg font-semibold mt-1">{formatViewCount(post.views)}</p>
                </div>
            </div>
        </div>
    )
}


