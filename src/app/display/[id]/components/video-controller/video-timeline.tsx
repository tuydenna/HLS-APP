import {JSX, useEffect, useState, createRef, useRef, RefObject} from "react";

export default function VideoTimeline({videoEl, sourceBufferRef}: {videoEl: HTMLVideoElement | null, sourceBufferRef: RefObject<SourceBuffer | null>}): JSX.Element {
    const [timeline, setTimeline] = useState<string>(".0")
    const [previewTimeline, setPreviewTimeline] = useState<string>(".0")
    const isScrubbingRef: RefObject<HTMLDivElement | boolean> = useRef(false)
    const timelineRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement | null>()
    const defaultPreviewTimelineRef: RefObject<number> = useRef<number>(0)

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
            const timeLine: number = videoEl!.currentTime / videoEl!.duration
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
                setTimeline(handleSeekVideo(e));
            } else {
                setPreviewTimeline(getCurrentTimelinePosition(e).toString());
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

        function resetPreviewTimeline() {
            // Reset To last current preview timeline
            setPreviewTimeline(defaultPreviewTimelineRef.current.toString())
        }

        function updatePreviewTimeline() {
            const sourceBuffer: SourceBuffer | null = sourceBufferRef.current;
            if (!sourceBuffer) {
                console.error("sourceBuffer is null")
                return;
            }
            const bufferTimeline: number  = sourceBuffer.buffered.end(sourceBuffer.buffered!.length - 1)
            const previewTimeline: number = bufferTimeline / videoEl!.duration;
            defaultPreviewTimelineRef.current = previewTimeline;
            setPreviewTimeline(previewTimeline.toString())
        }

        if (!videoEl) return

        videoEl.addEventListener("timeupdate", updateTimeline)
        videoEl.addEventListener("progress", updatePreviewTimeline)

        if (!timelineEl) return

        timelineEl.addEventListener("mousedown", mouseDownScrubbing)
        timelineEl.addEventListener("mousemove", mouseMoveOnTimeline)
        timelineEl.addEventListener("mouseleave",resetPreviewTimeline)

        document.addEventListener("mouseup", mouseUpEvent)
        document.addEventListener("mousemove", mouseMoveOnDocument)

        return () => {
            if (videoEl) {
                videoEl.removeEventListener("timeupdate", updateTimeline)
                videoEl.removeEventListener("progress", updatePreviewTimeline)
            }
            if (timelineEl) {
                timelineEl.removeEventListener("mousedown", mouseDownScrubbing)
                timelineEl.removeEventListener("mousemove", mouseMoveOnTimeline)
                timelineEl.removeEventListener("mouseleave",resetPreviewTimeline)
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