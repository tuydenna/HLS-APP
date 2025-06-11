import {JSX} from "react";
import {IComment} from "@app/types/comment";

export default function VideoComments ({comments}: {comments: IComment[]}): JSX.Element {
    console.log("comments", comments);

    return (
        <section className="mt-5 ml-2">
            <div className="flex">
                <div className="divider divider-start font-bold">Comments</div>
                <input type="text" placeholder="commenting" style={{padding: "10px", borderBottom: "1px  solid white"}} className="flex-1 h-10 rounded-3xl" />
            </div>
            {
                comments.map((comment: IComment) => {
                    return (
                        <section key={comment.id} title="list-comment" id="list-comment">
                            <div className="chat chat-start mt-3">
                                <div className="chat-bubble">
                                    {comment.comment}
                                </div>
                            </div>
                        </section>
                    )
                })
            }

        </section>
    )
}