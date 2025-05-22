"use server"

import MediaPayer from "@display/components/media-payer";
import {PropRoute} from "@app/types/props";
import {getPost,} from "@app/services/post-api";
import VideoAuthor from "@display/[id]/components/video-author";
import VideoComments from "@display/[id]/components/video-comments";
import {IVideoPost} from "@app/types/video-post";

export default async function Page(props: PropRoute<{ id: string }>) {

    // useEffect(function () {
    //     const createComment = async function (postId: string, comment: string) {
    //         return await fetch("/api/comments", {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             method: "POST",
    //             body: JSON.stringify({postId, comment})
    //         });
    //     }
    //     const likeOrUnlike = async function (id: string) {
    //         // const filled = getElById("btn-like-post").getAttribute("fill");
    //         const filled = "none";
    //         if (filled === 'none') {
    //             const res = await fetch('/api/posts/' + id + '/increase-likes?userId= <%= data.post.author.userId %>', {
    //                 method: "PUT"
    //             });
    //             const data = await res.json();
    //             if (res.ok) {
    //                 // getElById("stat-likes").innerText = data.likes;
    //                 // getElById("btn-like-post").setAttribute("fill", "blue")
    //             } else {
    //                 alert("Likes Failed!");
    //             }
    //         } else {
    //             const res = await fetch('/api/posts/' + id + '/decrease-likes?userId= <%= data.post.author.userId %>', {
    //                 method: "PUT"
    //             });
    //             const data = await res.json();
    //             if (res.ok) {
    //                 // getElById("btn-like-post").setAttribute("fill", "none")
    //                 // getElById("stat-likes").innerText = data.likes;
    //             } else {
    //                 alert("Likes Failed!");
    //             }
    //         }
    //     }
    // })

    const postId: string = (await props.params).id
    const post: IVideoPost = await getPost(postId)
    console.log(post);

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
                    <VideoComments comments={post.comments} />
                </div>
            </div>
            <div className="flex flex-col grow pl-5">
            </div>
        </div>
    )
}