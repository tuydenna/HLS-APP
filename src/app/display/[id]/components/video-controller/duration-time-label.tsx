import {RefObject, useEffect, useState} from "react";
import {formatVideoTimeUpdate, formatDuration} from "@util/video-config";

export default function DurationTimeLabel({videoEl}: {videoEl: HTMLVideoElement | null}) {
    const [duration, setDuration] = useState<string>("00:00")
    const [durationTime, setDurationTime] = useState<string>("00:00")

    useEffect(()=> {
        if (videoEl) {
            function loadedDataEvent() {
                alert("sd")
                setDuration(formatDuration(+videoEl!.duration))
            }
            function timeupdateEvent() {
                if (duration === "00:00") {

                }
                setDuration(formatDuration(+videoEl!.duration))
                const durationTime: string = formatVideoTimeUpdate(videoEl!.currentTime)
                setDurationTime(durationTime)
            }
            videoEl.addEventListener("loadstart", loadedDataEvent)
            videoEl.addEventListener("timeupdate", timeupdateEvent)

            return () => {
                if (videoEl) {
                    videoEl.removeEventListener("loadedmetadata", loadedDataEvent)
                    videoEl.removeEventListener("timeupdate", timeupdateEvent)
                }
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