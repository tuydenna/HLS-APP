"use client"

import Image from "next/image";
import VideoLikeView from "@display/[id]/components/content/video-like-view";
import {IVideoPost} from "@app/types/video-post";

export default function VideoAuthor ({post}: {post: IVideoPost}) {
    return (
        <section title="author">
            <div className="flex mt-3">
                <div className="flex justify-content-start">
                    <div className="avatar">
                        <div className="w-16 rounded-full min-w-20">
                            <Image alt="avatar" width={30} height={30} src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
                        </div>
                    </div>
                    <div className="flex-col ml-2 self-center">
                        <p className="mb-0">{post.author.name}</p>
                        <p className="text-sm">5 subscribers</p>
                    </div>
                </div>
                <VideoLikeView post={post}/>
            </div>
        </section>
    )
}


