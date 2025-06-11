"use client"

import {JSX, useEffect, useState} from "react";
import {IVideoPost} from "@app/types/video-post";
import {updateLikePost} from "@app/services/post-api";

export default function VideoLikeView({post}: {post: IVideoPost}): JSX.Element {
    const [isLike, setIsLike] = useState(false);

    const toggleLike = async function (postId: string) {
        await updateLikePost(postId, post.authorId)
        setIsLike(!isLike);
    }

    useEffect(() => {
        console.log("useEffect", post.likePosts.length && post.likePosts[0].like,  post.likePosts);
        setIsLike(Boolean((post.likePosts.length && post.likePosts[0].like)))
    }, [])

    return (
        <div className="flex flex-1 justify-end self-center" style={{alignSelf: "center"}}>
            <div>
                <div className="stats shadow">
                    <div className="stat" style={{padding: "10px"}}>
                        <div className="stat-figure text-primary" onClick={()=> toggleLike(post.id)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={isLike ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title">Likes</div>
                        <div className="stat-value text-primary" style={{fontSize: "1.5rem"}}>{post.likes}K</div>
                    </div>

                    <div className="stat" style={{padding: "10px"}}>
                        <div className="stat-figure text-secondary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title">Views</div>
                        <div className="stat-value text-secondary" style={{fontSize: "1.5rem"}}>{post.views}M</div>
                    </div>
                </div>
            </div>
        </div>
    )
}