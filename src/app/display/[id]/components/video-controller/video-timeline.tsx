import {JSX, useEffect, useState, createRef, useRef, RefObject} from "react";

export default function VideoTimeline({videoEl}: {videoEl: HTMLVideoElement | null}): JSX.Element {
    const [timeline, setTimeline] = useState<string>(".0")
    const [previewTimeline, setPreviewTimeline] = useState<string>(".0")
    const isScrubbingRef: RefObject<HTMLDivElement | boolean> = useRef(false)
    const timelineRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement | null>()

    useEffect(()=>{
        const timelineEl: HTMLDivElement = timelineRef.current!;

        function handleSeekVideo(e:MouseEvent): string {
            const currentTimeline: number = getCurrentTimelinePosition(e);
            videoEl!.currentTime = currentTimeline * videoEl!.duration;
            return currentTimeline.toString()
        }

        function getCurrentTimelinePosition(e:MouseEvent): number {
            const rect: DOMRect = timelineEl.getBoundingClientRect()
            return Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
        }

        function updateTimeline() {
            const timeLine: number = videoEl!.currentTime/videoEl!.duration
            console.log("timeline", timeLine);
            if(timeLine <= 1) {
                setTimeline(timeLine.toString())
            }
        }

        function mouseDownScrubbing(e: MouseEvent) {
            e.preventDefault()
            isScrubbingRef.current = true;
            handleSeekVideo(e);
            videoEl!.pause()
        }

        function mouseMoveOnTimeline(e: MouseEvent) {
            if (isScrubbingRef.current) {
                setTimeline(handleSeekVideo(e))
            } else {
                setPreviewTimeline(getCurrentTimelinePosition(e).toString())
            }
        }

        function mouseMoveOnDocument(e: MouseEvent) {
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

        if (videoEl) {
            videoEl.addEventListener("timeupdate", updateTimeline)
        }
        if (timelineEl) {
            timelineEl.addEventListener("mousedown", mouseDownScrubbing)
            timelineEl.addEventListener("mousemove", mouseMoveOnTimeline)
        }

        document.addEventListener("mouseup", mouseUpEvent)
        document.addEventListener("mousemove", mouseMoveOnDocument)

        return () => {
            if (videoEl) {
                videoEl.removeEventListener("timeupdate", updateTimeline)
            }
            if (timelineEl) {
                timelineEl.removeEventListener("mousedown", mouseDownScrubbing)
                timelineEl.removeEventListener("mousemove", mouseMoveOnTimeline)
            }
            document.removeEventListener("mouseup", mouseUpEvent)
            document.removeEventListener("mousemove", mouseMoveOnDocument)
        }
    }, [videoEl, timeline, previewTimeline])

    return (
        <div ref={timelineRef} className="timeline-container" style={{"--preview-position": previewTimeline , "--progress-position": timeline}}>
            <div className="timeline">
                <img className="preview-img" alt={""}/>
                <div className="thumb-indicator"></div>
            </div>
        </div>
    )

}