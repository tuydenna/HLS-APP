"use client"

import React from "react";
import {LeftSideLayout} from "@app/upload-studio/components/left-side-layout";
import {RightSideLayout} from "@app/upload-studio/components/right-side-layout";
import {IVideoPost} from "@interfaces/video-post";

export default function CreatePostDashboard() {

    const [createPost, setCreatePost] = React.useState<IVideoPost>();

    return (
        <div className="flex p-6 gap-6">
            <LeftSideLayout setCreatedPost={(post: IVideoPost)=> setCreatePost(post)} />
            <RightSideLayout newPost={createPost} />
        </div>
    );
}

