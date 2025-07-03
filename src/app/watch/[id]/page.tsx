"use server"

import MediaPayer from "@watch/[id]/components/content/media-payer";
import {PropRoute} from "@interfaces/props";
import {IVideoPost} from "@interfaces/video-post";
import PostService from "@services/postv2-api";
import {getCookieAuthHeader} from "@lib/next-adapter";
import ListRelatedPosts from "@watch/[id]/components/list/list-related-posts";
import PostInfo from "@watch/[id]/components/content/post-info";
import Header from "@components/layout/header";

export default async function Page(props: PropRoute<{ id: string }>) {

    const postId: string = (await props.params).id
    const post: IVideoPost = await new PostService().setHeaders(await getCookieAuthHeader()).getOne(postId + "?authId=" + postId );

    return (
        <div className="relative">
            <Header/>
            <div className="flex p-5">
                <div className="flex-none w-2/3">
                    <MediaPayer video={post.video}/>
                    <PostInfo post={post} />
                </div>
                <ListRelatedPosts/>
            </div>
        </div>

    )
}


