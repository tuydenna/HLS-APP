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

        function timeupdateEvent() {
            const durationTime: string = formatVideoTimeUpdate(videoEl!.currentTime)
            setDurationTime(durationTime)
        }

        videoEl.addEventListener("loadedmetadata", initDuration)
        videoEl.addEventListener("canplay", function () {
            // videoEl.play()
            // videoEl.muted = false
            console.log("canplay")
        })
        videoEl.addEventListener("timeupdate", timeupdateEvent)

        return () => {
            if (videoEl) {
                videoEl.removeEventListener("loadedmetadata", initDuration)
                videoEl.removeEventListener("timeupdate", timeupdateEvent)
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