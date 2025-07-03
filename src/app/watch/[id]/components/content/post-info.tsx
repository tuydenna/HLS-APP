"use client"

import {useState} from 'react';
import {Card} from "@app/components/ui/card";
import {IVideoPost} from "@interfaces/video-post";
import VideoComments from "@watch/[id]/components/content/video-comments";
import {Separator} from "@radix-ui/react-menu";
import VideoAuthor from "@watch/[id]/components/content/video-author";
import VideoDescription from "@watch/[id]/components/content/video-desciption";
import {IUser} from "@interfaces/user";
import {getAuth} from "@lib/utils";
import {onDidMount} from "@lib/react-adapter";
import {PostInfoSkeleton} from "@components/skeleton/post-info-skeleton";

export default function PostInfo({post}: {post: IVideoPost}) {

    const [auth, setAuth] = useState<IUser | null>(null);

    onDidMount(function () {
        setAuth(getAuth())
    })

    return (
       <div className="bg-background text-foreground antialiased min-h-screen">
            <div className="w-full">
                <Card className="gap-1 p-3">
                    {
                        auth ?
                             <>
                                 <p className="text-lg font-bold">{post.title}</p>
                                 <VideoAuthor post={post} auth={auth!} />
                                 <Separator />
                                 <VideoDescription post={post} />
                                 <Separator />
                                 <VideoComments auth={auth!} comments={post.comments} postId={post.id} />
                             </>
                            :
                            <PostInfoSkeleton/>
                    }
                </Card>
            </div>
        </div>
    )
}
