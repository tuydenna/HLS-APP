import {RefObject, useState} from "react";

export default function PlayBackRateButton({videoEl}: {videoEl: HTMLVideoElement | null}) {

    const [playBackRate, setPlaybackRate] = useState(1)
    const changePlaybackSpeed = function () {
        if (videoEl) {
            let rate: number = playBackRate + 0.25;
            if (videoEl.playbackRate >= 2) {
                rate = 0.25
            }
            videoEl.playbackRate = rate;
            setPlaybackRate(rate)
        }
    }

    return (
        <button className="speed-btn wide-btn" onClick={changePlaybackSpeed}>
            {playBackRate}x
        </button>
    )
}