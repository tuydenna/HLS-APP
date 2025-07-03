"use client"

import React, {JSX} from "react";
import {LeftSideLayout} from "@studio/components/left-side-layout";
import {RightSideLayout} from "@studio/components/right-side-layout";
import {IVideoPost} from "@interfaces/video-post";

export default function CreatePostDashboard(): JSX.Element {

    const [createPost, setCreatePost] = React.useState<IVideoPost>();

    return (
        <div className="flex p-6 gap-6">
            <LeftSideLayout setCreatedPost={(post: IVideoPost)=> setCreatePost(post)} />
            <RightSideLayout newPost={createPost} />
        </div>
    );
}

