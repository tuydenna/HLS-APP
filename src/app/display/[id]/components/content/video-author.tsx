"use client"

import {IVideoPost} from "@interfaces/video-post";
import { AvatarUI} from "@app/components/ui/avatar";
import {CardDescription, CardTitle} from "@app/components/ui/card";
import {Button} from "@app/components/ui/button";
import {Heart} from "lucide-react";
import React, {useState} from "react";
import {getImageURL} from "@util/helper";
import PostService from "@services/postv2-api";
import {IUser} from "@interfaces/user";

export default function VideoAuthor ({post, auth}: {post: IVideoPost, auth: IUser}) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
        return num.toString();
    };

    async function onLike() {
        await new PostService().likePost(post.id, auth.id)
        setIsLiked(true);
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
               <AvatarUI src={getImageURL(post.author.avatar)} fallbackName={post.author.name} widthClass="w-20" heightClass="h-20"/>
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
                        onClick={onLike}
                    >
                        <Heart className={"h-7 w-7 transition-colors " + (post.likes ? 'text-red-500 fill-red-500' : 'text-muted-foreground group-hover:text-red-400')} />
                    </Button>
                    <p className="text-lg font-semibold mt-1">{formatNumber(likeCount)}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-muted-foreground h-12 flex items-center">Views</p>
                    <p className="text-lg font-semibold mt-1">{formatNumber(post.views)}</p>
                </div>
            </div>
        </div>
    )
}


