"use client"

import React, {useState} from 'react';
import {Card} from "@app/components/ui/card";
import {IVideoPost} from "@interfaces/video-post";
import VideoComments from "@display/[id]/components/content/video-comments";
import {Separator} from "@radix-ui/react-menu";
import VideoAuthor from "@display/[id]/components/content/video-author";
import VideoDescription from "@display/[id]/components/content/video-desciption";
import {IUser} from "@interfaces/user";

export default function PostInfo({post}: {post: IVideoPost}) {
    const [auth, setAuth] = useState<IUser>(JSON.parse(localStorage.getItem("auth")!));
    return (
        <div className="bg-background text-foreground antialiased min-h-screen">
            <div className="w-full">
                <Card className="gap-1 p-3">
                    <p className="text-lg font-bold">{post.title}</p>
                    <VideoAuthor post={post} auth={auth} />
                    <Separator />
                    <VideoDescription post={post} />
                    <Separator />
                    <VideoComments auth={auth} comments={post.comments} postId={post.id} />
                </Card>
            </div>
        </div>
    );
}
