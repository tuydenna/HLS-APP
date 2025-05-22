import {JSX} from "react";
import {IComment} from "@app/types/comment";

export default function VideoComments ({comments}: {comments: IComment[]}): JSX.Element {
    return (
        <section className="mt-5 ml-2">
            <div className="flex">
                <div className="divider divider-start font-bold">Comments</div>
                <input type="text" placeholder="commenting" style={{padding: "10px", borderBottom: "1px  solid white"}} className="flex-1 h-10 rounded-3xl" />
            </div>
        </section>
    )
}