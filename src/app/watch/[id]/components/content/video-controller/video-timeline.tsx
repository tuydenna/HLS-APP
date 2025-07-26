import {JSX, useEffect, useState, createRef, useRef, RefObject, CSSProperties} from "react";

export default function VideoTimeline({videoEl, sourceBufferRef, onSeekVideoDuration}: {videoEl: HTMLVideoElement | null, sourceBufferRef: RefObject<SourceBuffer | null>, onSeekVideoDuration: Function}): JSX.Element {
    const [timeline, setTimeline] = useState<number>(.0)
    const [previewTimeline, setPreviewTimeline] = useState<number>(.0)
    const isScrubbingRef: RefObject<HTMLDivElement | boolean> = useRef(false)
    const timelineRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement | null>()
    const defaultPreviewTimelineRef: RefObject<number> = useRef<number>(0)

    useEffect(()=>{
        const timelineEl: HTMLDivElement = timelineRef.current!;

        function getCurrentTimelinePosition(e:MouseEvent): number {
            const rect: DOMRect = timelineEl.getBoundingClientRect()
            return Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
        }

        function updateTimeline() {
            const timeLine: number = videoEl!.currentTime / videoEl!.duration
            if(timeLine <= 1) {
                setTimeline(timeLine)
            }
        }

        function mouseDownScrubbing(e: MouseEvent) {
            e.preventDefault()
            isScrubbingRef.current = true;
            videoEl!.pause()
        }

        function mouseMoveOnTimeline(e: MouseEvent) {
            if (isScrubbingRef.current) {
                setTimeline(getCurrentTimelinePosition(e));
            } else {
                setPreviewTimeline(getCurrentTimelinePosition(e));
            }
        }

        function mouseMoveOnDocument(e: MouseEvent) {
            if (isScrubbingRef.current) {
                setTimeline(getCurrentTimelinePosition(e))
            }
        }

        function onSeekingVideo(e: MouseEvent) {
            if (isScrubbingRef.current) {
                const currentTimeline: number = getCurrentTimelinePosition(e)
                isScrubbingRef.current = false;
                setTimeline(currentTimeline);
                const currentTime: number = currentTimeline * videoEl!.duration
                onSeekVideoDuration(currentTime);
            }
        }

        function resetPreviewTimeline() {
            // Reset To last current preview timeline
            setPreviewTimeline(defaultPreviewTimelineRef.current)
        }

        function updatePreviewTimeline() {
            const sourceBuffer: SourceBuffer | null = sourceBufferRef.current;
            if (!sourceBuffer) {
                console.error("sourceBuffer is null")
                return;
            }
            if (sourceBuffer.buffered!.length) {
                const bufferTimeline: number  = sourceBuffer.buffered.end(sourceBuffer.buffered!.length - 1)
                const previewTimeline: number = bufferTimeline / videoEl!.duration;
                defaultPreviewTimelineRef.current = previewTimeline;
                setPreviewTimeline(previewTimeline)
            }
        }

        if (!videoEl) return

        videoEl.addEventListener("timeupdate", updateTimeline)
        videoEl.addEventListener("progress", updatePreviewTimeline)

        if (!timelineEl) return

        timelineEl.addEventListener("mousedown", mouseDownScrubbing)
        timelineEl.addEventListener("mousemove", mouseMoveOnTimeline)
        timelineEl.addEventListener("mouseleave",resetPreviewTimeline)

        document.addEventListener("mouseup", onSeekingVideo)
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
            document.removeEventListener("mouseup", onSeekingVideo)
            document.removeEventListener("mousemove", mouseMoveOnDocument)
        }
    }, [videoEl, timeline, previewTimeline])

    return (
        <div ref={timelineRef} className="timeline-container" style={{"--preview-position": previewTimeline , "--progress-position": timeline} as unknown as CSSProperties}>
            <div className="timeline">
                <img className="preview-img" alt={""}/>
                <div className="thumb-indicator"></div>
            </div>
        </div>
    )

}