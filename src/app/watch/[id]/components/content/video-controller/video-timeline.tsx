import {JSX, useEffect, createRef, useRef, RefObject} from "react";

export default function VideoTimeline({videoEl, sourceBufferRef, onSeekVideoDuration}: {videoEl: HTMLVideoElement | null, sourceBufferRef: RefObject<SourceBuffer | null>, onSeekVideoDuration: Function}): JSX.Element {
    const seekConfigRef: RefObject<{isPlayed: boolean, isScrubbing: boolean, seekTimeout: NodeJS.Timeout | undefined}> = useRef({isPlayed: false, isScrubbing: false, seekTimeout: undefined})
    const timelineRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement | null>()
    const defaultPreviewTimelineRef: RefObject<number> = useRef<number>(0)

    useEffect(()=> {
        const timelineEl: HTMLDivElement | null = timelineRef.current;

        if (!videoEl || !timelineEl) return;

        const ontimeupdateUpdateTimeline = function () {
            const timeLine: number = videoEl!.currentTime / videoEl!.duration
            if(timeLine <= 1) {
                updateDisplayTimeline(timeLine.toString())
            }
        }

        const onmousedownScrubbing = function (e: MouseEvent | TouchEvent) {
            e.preventDefault()
            seekConfigRef.current.isScrubbing = true;
            seekConfigRef.current.isPlayed = !videoEl?.paused;
            videoEl!.pause();
        }

        const onmousemoveUpdateDisplayTimeline = function (e: MouseEvent | TouchEvent) {
            const value: string = getCurrentTimelinePosition(e).toString();
            if (seekConfigRef.current.isScrubbing) {
                updateDisplayTimeline(value)
            } else {
                updateDisplayBufferTimeline(value)
            }
        }

        const onmousemoveOnDocument = function (e: MouseEvent | TouchEvent) {
            if (seekConfigRef.current.isScrubbing) {
                updateDisplayTimeline(getCurrentTimelinePosition(e).toString());
            }
        }

        const onSeekingVideo = function (e: MouseEvent | TouchEvent) {
            if (seekConfigRef.current.isScrubbing) {
                const currentTimeline: number = getCurrentTimelinePosition(e)
                seekConfigRef.current.isScrubbing = false;

                updateDisplayTimeline(currentTimeline.toString())
                const currentTime: number = currentTimeline * videoEl!.duration;

                clearTimeout(seekConfigRef.current.seekTimeout)
                seekConfigRef.current.seekTimeout  = setTimeout(function (){
                    onSeekVideoDuration(currentTime);
                    if (seekConfigRef.current.isPlayed) videoEl!.play();
                }, 1000)
            }
        }

        const onmouseleaveResetDefaultBufferTimeline = function () {
            // Reset To last current preview timeline
            updateDisplayBufferTimeline(defaultPreviewTimelineRef.current.toString());
        }

        const onprogressUpdateBufferTimeline = function () {
            const sourceBuffer: SourceBuffer | null = sourceBufferRef.current;
            if (!sourceBuffer) {
                console.log("[onprogressUpdateBufferTimeline]:", "sourceBuffer is null")
                return;
            }
            if (sourceBuffer.buffered!.length) {
                const bufferTimeline: number  = sourceBuffer.buffered.end(sourceBuffer.buffered!.length - 1)
                const previewTimeline: number = bufferTimeline / videoEl!.duration;
                defaultPreviewTimelineRef.current = previewTimeline;
                updateDisplayBufferTimeline(previewTimeline.toString());
            }
        }

        const onseekingReplayVideo = function () {
            if (isReplay()) {
                updateDisplayTimeline(".0");
                onmouseleaveResetDefaultBufferTimeline();
            }
        }

        function getCurrentTimelinePosition(e:MouseEvent | TouchEvent): number {
            const rect: DOMRect = timelineRef.current!.getBoundingClientRect();
            const x: number = "changedTouches" in e ? e.changedTouches[0].clientX : e.x;
            return Math.min(Math.max(0, x - rect.x), rect.width) / rect.width;
        }

        function updateDisplayTimeline(value: string) {
            timelineRef.current!.style.setProperty("--progress-position", value)
        }

        function updateDisplayBufferTimeline(value: string) {
            timelineRef.current!.style.setProperty("--preview-position", value)
        }

        function isReplay() {
            return videoEl!.currentTime === 0;
        }

        videoEl.addEventListener("timeupdate", ontimeupdateUpdateTimeline)
        videoEl.addEventListener("progress", onprogressUpdateBufferTimeline)
        videoEl.addEventListener("seeking", onseekingReplayVideo);

        timelineEl.addEventListener("mousedown", onmousedownScrubbing)
        timelineEl.addEventListener("mousemove", onmousemoveUpdateDisplayTimeline)
        timelineEl.addEventListener("mouseleave", onmouseleaveResetDefaultBufferTimeline)

        document.addEventListener("mouseup", onSeekingVideo)
        document.addEventListener("mousemove", onmousemoveOnDocument)
        // Smartphone Event
        timelineEl.addEventListener("touchstart", onmousedownScrubbing)
        timelineEl.addEventListener("touchmove", onmousemoveUpdateDisplayTimeline)
        timelineEl.addEventListener("touchcancel", onmousemoveUpdateDisplayTimeline)
        document.addEventListener("touchend", onSeekingVideo)
        document.addEventListener("touchmove", onmousemoveOnDocument)

        console.log("did mount");

        return () => {
            videoEl.removeEventListener("timeupdate", ontimeupdateUpdateTimeline)
            videoEl.removeEventListener("progress", onprogressUpdateBufferTimeline)
            videoEl.removeEventListener("seeking", onseekingReplayVideo);

            timelineEl.removeEventListener("mousedown", onmousedownScrubbing)
            timelineEl.removeEventListener("mousemove", onmousemoveUpdateDisplayTimeline)
            timelineEl.removeEventListener("mouseleave", onmouseleaveResetDefaultBufferTimeline)

            document.removeEventListener("mouseup", onSeekingVideo)
            document.removeEventListener("mousemove", onmousemoveOnDocument)
            // Smartphone Event
            timelineEl.removeEventListener("touchstart", onmousedownScrubbing)
            timelineEl.removeEventListener("touchmove", onmousemoveUpdateDisplayTimeline)
            timelineEl.removeEventListener("touchcancel", onmousemoveUpdateDisplayTimeline)
            document.removeEventListener("touchend", onSeekingVideo)
            document.removeEventListener("touchmove", onmousemoveOnDocument)
        }
    }, [videoEl, timelineRef])

    return (
        <div ref={timelineRef} className="timeline-container" >
            <div className="timeline">
                <img className="preview-img" alt={""}/>
                <div className="thumb-indicator"></div>
            </div>
        </div>
    )
}