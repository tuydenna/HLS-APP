import React from "react";
import {IVideoPost} from "@interfaces/video-post";
import {getCookieAuthHeader} from "@lib/next-adapter";
import HomeListPostsSkeleton from "@components/skeleton/home-list-posts-skeleton";
import ImageLoaderWrapper from "@components/optimize/ImageLoaderWrapper";
import PostList from "@app/search/components/post-list";
import SearchService from "@services/search-service";

export default async function Content(props: {params?: Promise<{searchKey: string}>}) {
    const param = await props.params;
    const posts: IVideoPost[] = await new SearchService()
        .setHeaders(await getCookieAuthHeader())
        .searchPosts(param?.searchKey ? decodeURIComponent(param?.searchKey) : undefined);
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