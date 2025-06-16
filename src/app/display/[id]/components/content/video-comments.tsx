"use client"

import {JSX, RefObject, useEffect, useRef, useState} from "react";
import {IComment} from "@app/types/comment";
import CommentService from "@app/services/comment-api";
import moment from "moment/moment";

export default function VideoComments ({postId, comments}: {postId: string, comments: IComment[]}): JSX.Element {

    const commentRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
    const [commentList, setCommentList] = useState<IComment[]>(comments);

    useEffect(() => {
        async function postComment(event: KeyboardEvent) {
            if (event.key === "Enter") {
                try {
                    const comment: IComment = await new CommentService().create({postId, text: commentRef.current!.value});
                    commentRef.current!.value = "";
                    setCommentList([comment, ...commentList]);
                } catch (e) {
                    console.error(e);
                }
            }
            return
        }
        
        commentRef.current?.addEventListener("keydown", postComment)
        
        return () => {
            commentRef.current?.removeEventListener("keydown", postComment)
        }
    }, [commentList]);

    console.log("commentList", commentList);

    return (
        <section className="mt-5 ml-2">
            <div className="flex">
                <div className="divider divider-start font-bold">Comment</div>
                <input type="text" ref={commentRef} style={{padding: "10px", borderBottom: "1px  solid gray"}} className="flex-1 h-10 rounded-3xl" />
            </div>
            {
                commentList.map((comment: IComment) => {
                    return (
                        <section key={comment.id} title="list-comment" id="list-comment">
                            <div className="chat chat-start mt-3">
                                <div className="chat-bubble text-sm">
                                    {comment.text}
                                    <div className="text-[10px] text-gray-400">{moment(comment.createdAt).fromNow()}</div>
                                </div>
                            </div>
                        </section>
                    )
                })
            }
        </section>
    )
}