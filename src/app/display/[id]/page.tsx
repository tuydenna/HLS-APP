"use server"

import MediaPayer from "@display/[id]/components/content/media-payer";
import {PropRoute} from "@app/types/props";
import {getPost,} from "@app/services/post-api";
import VideoAuthor from "@display/[id]/components/content/video-author";
import VideoComments from "@display/[id]/components/content/video-comments";
import {IVideoPost} from "@app/types/video-post";
import RightSideRelatedPosts from "@display/[id]/components/right-side";

export default async function Page(props: PropRoute<{ id: string }>) {

    const postId: string = (await props.params).id
    const post: IVideoPost = await getPost(postId)

    return (
        <div className="flex p-5">
            <div className="flex-none w-2/3">
                <MediaPayer video={post.video}/>
                <div className="p-2">
                    <section title="video-title">
                        <p className="text-lg font-bold text-xl">
                            {post.title}
                        </p>
                    </section>
                    <VideoAuthor post={post} />
                    <section title="description" className="mt-5">
                        <div tabIndex={0} className="collapse bg-base-200">
                            <div className="collapse-title text-[18px] font-medium">Description</div>
                            <div className="collapse-content text-[16px]">
                                <p>
                                    {post.description}
                                </p>
                            </div>
                        </div>
                    </section>
                    <VideoComments comments={post.comments} postId={postId} />
                </div>
            </div>
            <RightSideRelatedPosts/>
        </div>
    )
}