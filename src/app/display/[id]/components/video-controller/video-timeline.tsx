import {JSX, useEffect, useState, createRef, useRef, RefObject} from "react";

export default function VideoTimeline({videoEl}: {videoEl: HTMLVideoElement | null}): JSX.Element {
    const [timeline, setTimeline] = useState<string>(".0")
    const isScrubbingRef: RefObject<HTMLDivElement | boolean> = useRef(false)
    const timelineRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement | null>()

    useEffect(()=>{
        function updateTimeline() {
            const timeLine: number = videoEl!.currentTime/videoEl!.duration
            if(timeLine <= 1) {
                setTimeline(timeLine.toString())
            }
        }

        const timelineEl: HTMLDivElement = timelineRef.current!;

        function mouseDownScrubbing(e: MouseEvent) {
            e.preventDefault()
            isScrubbingRef.current = true;
            handleSeekVideo(e);
            videoEl!.pause()
        }

        function mouseMoveEvent(e: MouseEvent) {
            if (isScrubbingRef.current) {
                setTimeline(handleSeekVideo(e))
            }
        }

        function mouseUpEvent(e: MouseEvent) {
            if (isScrubbingRef.current) {
                handleSeekVideo(e)
                isScrubbingRef.current = false;
                videoEl!.play()
            }
        }

        function handleSeekVideo(e:MouseEvent): string {
            const rect: DOMRect = timelineEl.getBoundingClientRect()
            const currentTimeline: number = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
            videoEl!.currentTime = currentTimeline * videoEl!.duration;
            return currentTimeline.toString()
        }

        if (videoEl) {
            videoEl.addEventListener("timeupdate", updateTimeline)
        }
        if (timelineEl) {
            timelineEl.addEventListener("mousedown", mouseDownScrubbing)
            timelineEl.addEventListener("mousemove", mouseMoveEvent)
        }

        document.addEventListener("mouseup", mouseUpEvent)
        document.addEventListener("mousemove", mouseMoveEvent)

        return () => {
            if (videoEl) {
                videoEl.removeEventListener("timeupdate", updateTimeline)
            }
            if (timelineEl) {
                timelineEl.removeEventListener("mousedown", mouseDownScrubbing)
                timelineEl.removeEventListener("mousemove", mouseMoveEvent)
            }
            document.removeEventListener("mouseup", mouseUpEvent)
            document.removeEventListener("mousemove", mouseMoveEvent)
        }
    }, [videoEl, timeline])

    return (
        <div ref={timelineRef} className="timeline-container" style={{"--preview-position": ".19", "--progress-position": timeline}}>
            <div className="timeline">
                <img className="preview-img" alt={""}/>
                <div className="thumb-indicator"></div>
            </div>
        </div>
    )

}