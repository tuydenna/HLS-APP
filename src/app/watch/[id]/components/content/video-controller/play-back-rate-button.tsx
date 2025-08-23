import {useState} from "react";

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
        <button  className="speed-btnspeed-btn wide-btn text-base md:text-lg" onClick={changePlaybackSpeed}>
            {playBackRate}x
        </button>
    )
}