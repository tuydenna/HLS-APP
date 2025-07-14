import {IVideoPost} from "@interfaces/video-post";
import PostService from "@services/post-service";
import {getCookieAuthHeader} from "@lib/next-adapter";
import React from "react";
import HomeListPostsSkeleton from "@components/skeleton/home-list-posts-skeleton";
import ImageLoaderWrapper from "@app/home/ImageLoaderWrapper";
import PostList from "@app/home/components/post-list";

export default async function Content() {

    const posts: IVideoPost[] = await new PostService().setHeaders(await getCookieAuthHeader()).getMany();
    return (
        posts.length ?
            <div className="m-5 w-[80%]">
                <ImageLoaderWrapper fallBack={<HomeListPostsSkeleton/>}>
                    <PostList posts={posts} />
                </ImageLoaderWrapper>
            </div>
            :
        <div className="flex justify-center items-center w-full">
            No content ...
        </div>
    )
}