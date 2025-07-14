import {useEffect, useState} from "react";
import {formatVideoTimeUpdate, formatDuration} from "@util/video-config";

export default function DurationTimeLabel({videoEl}: {videoEl: HTMLVideoElement | null}) {
    const [duration, setDuration] = useState<string>("00:00")
    const [durationTime, setDurationTime] = useState<string>("00:00")

    useEffect(()=> {

        if (!videoEl) return

        function initDuration() {
            if (videoEl?.duration) {
                setDuration(formatDuration(+videoEl.duration))
            }
        }

        function autoPlay() {
            videoEl?.play();
        }

        function timeupdateEvent() {
            const durationTime: string = formatVideoTimeUpdate(videoEl!.currentTime)
            setDurationTime(durationTime)
        }

        videoEl.addEventListener("loadedmetadata", initDuration)
        videoEl.addEventListener("timeupdate", timeupdateEvent)
        videoEl.addEventListener("canplay", autoPlay)

        return () => {
            if (videoEl) {
                videoEl.removeEventListener("loadedmetadata", initDuration)
                videoEl.removeEventListener("timeupdate", timeupdateEvent)
                videoEl.removeEventListener("canplay", autoPlay)
            }
        }
    }, [videoEl])

    return (
        <div className="duration-container">
            <div className="current-time">{durationTime}</div>
            / {duration}
            <div className="total-time"></div>
        </div>
    )

}