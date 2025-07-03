import React from "react";
import {IVideoPost} from "@interfaces/video-post";
import {timeAgo} from "@util/helper";

export default function VideoDescription({post}: {post: IVideoPost}) {
    return (
        <div className="bg-gray-100 rounded-sm p-2">
            <span className="text-sm font-semibold">{timeAgo(post.createdAt)}</span>
            <p className="text-muted-foreground leading-relaxed">
                {post.description}
            </p>
        </div>
    )
}