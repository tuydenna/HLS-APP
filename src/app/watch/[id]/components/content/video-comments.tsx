"use client"

import React, {JSX, RefObject, useRef, useState} from "react";
import {IComment} from "@interfaces/comment";
import CommentService from "@services/comment-api";
import {getImageURL, timeAgo} from "@util/helper";
import { AvatarUI} from "@app/components/ui/avatar";
import {Textarea} from "@app/components/ui/textarea";
import {Button} from "@app/components/ui/button";
import {MessageCircle} from "lucide-react";
import {onDidMount} from "@lib/react-adapter";
import {IUser} from "@interfaces/user";

export default function VideoComments ({postId, comments, auth}: {postId: string, auth: IUser, comments: IComment[]}): JSX.Element {

    const [commentList, setCommentList] = useState<IComment[]>(comments);

    onDidMount(function (): void {
        setCommentList(comments);
    })

    function addNewComment(comment: IComment) {
        setCommentList([comment, ...commentList])
    }

    return (
       <>
           <h3 className="text-xl font-semibold mb-6">Comments ({comments.length})</h3>
           <CommentForm postId={postId} auth={auth} addNewComment={addNewComment}/>
           <CommentList comments={commentList} />
       </>
    )
}

function CommentForm({ postId, addNewComment, auth }: {postId: string, addNewComment: Function, auth: IUser}) {
    const commentRef: RefObject<HTMLTextAreaElement | null> = useRef(null);

    async function onLeaveComment() {
        const comment: string = commentRef.current!.value;

        if (!comment.trim()){
            alert("Please enter a comment")
            return;
        }

        try {
            const newComment: IComment = await new CommentService().create({
                text: comment,
                authorId: auth.id,
                postId
            });
            commentRef.current!.value = "";
            addNewComment(newComment);
        } catch (e) {
            alert("Something went wrong!, try again later");
        }
    }

    return (
        <div className="flex items-start space-x-4">
            <AvatarUI src={getImageURL(auth.avatar)} fallbackName={auth.name} />
            <div className="flex-1">
                <Textarea
                    placeholder="Leave a comment..."
                    ref={commentRef}
                />
                <Button className="mt-3" onClick={onLeaveComment} disabled={false}>
                    <MessageCircle className="mr-2 h-4 w-4" /> Comment
                </Button>
            </div>
        </div>
    );
}

function CommentList({ comments }: {comments: IComment[]}) {
    return (
        <div className="mt-8 space-y-6">
            {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <AvatarUI src={getImageURL(comment.author.avatar)} fallbackName={comment.author.name} widthClass="w-10" heightClass="h-10"/>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <p className="font-semibold text-sm">{comment.author?.name}</p>
                            <p className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</p>
                        </div>
                        <p className="mt-1 text-card-foreground/90 ">{comment.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

