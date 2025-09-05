import React, {useRef, useState} from "react";
import {IVideoPost} from "@interfaces/video-post";
import {timeAgo} from "@util/helper";
import {onDidMount} from "@lib/react-adapter";

export default function VideoDescription({post}: {post: IVideoPost}) {

    const descRef = useRef<HTMLPreElement>(null);
    const [isMoreDesc, setIsMoreDesc] = useState<boolean>(false);

    onDidMount(function () {
        // Check if the content is overflowing
        const isClamped: boolean = descRef.current!.scrollHeight > descRef.current!.clientHeight;

        // If the text is clamped, show the "See more" button
        if (isClamped) {
            setIsMoreDesc(true);
        }
    })

    function toggleReadMore() {
        descRef.current!.classList.toggle("line-clamp-3");
        setIsMoreDesc(!isMoreDesc);
    }

    return (
        <div className="relative bg-gray-100 rounded-sm p-2 overflow-hidden">
            <span className="text-sm font-semibold">{timeAgo(post.createdAt)}</span>
            <pre ref={descRef} className={`text-muted-foreground leading-relaxed text-wrap line-clamp-3`}>
                {post.description}
            </pre>
            <button id="toggle-read-more" onClick={toggleReadMore} className={`${isMoreDesc ? "block" : "hidden"} absolute bottom-2 right-2 z-10  pl-4 bg-gray-100 text-blue-500 font-semibold cursor-pointer`}>
                ...see more
            </button>
            <button id="toggle-read-more" onClick={toggleReadMore} className={`${isMoreDesc ? "hidden" : "block"} absolute bottom-2 right-2 z-10  pl-4 bg-gray-100 text-blue-500 font-semibold cursor-pointer`}>
                ...see less
            </button>
        </div>
    )
}