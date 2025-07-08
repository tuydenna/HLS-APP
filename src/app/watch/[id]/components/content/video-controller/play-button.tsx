import { useEffect, useState} from "react";

export default function PlayButton({videoEl}: {videoEl: HTMLVideoElement | null}) {
    const [isPlay, setIsPlay] = useState(false)

    useEffect(() => {
        function playOrPauseVideo() {
            if (isPlay) {
                videoEl?.pause()
            } else {
                videoEl?.play()
            }
            setIsPlay(!isPlay)
        }
        function playVideoInPictureMode() {
            if (videoEl) {
                if (isPlay === false) {
                    setIsPlay(true)
                }
            }
        }
        function pauseVideoInPictureMode() {
            if (videoEl) {
                if (isPlay === true) {
                    setIsPlay(false)
                }
            }
        }
        function pauseVideo() {
            videoEl?.pause();
            setIsPlay(false);
        }
        if (videoEl) {
            videoEl.addEventListener("leavepictureinpicture",playOrPauseVideo)
            videoEl.addEventListener("ended", pauseVideo)
            videoEl.addEventListener("click", playOrPauseVideo)
            videoEl.addEventListener("play", playVideoInPictureMode)
            videoEl.addEventListener("pause", pauseVideoInPictureMode)
        }
        return () => {
            if (videoEl) {
                videoEl.removeEventListener('leavepictureinpicture', playOrPauseVideo);
                videoEl.removeEventListener('ended', pauseVideo);
                videoEl.removeEventListener('click', playOrPauseVideo);
                videoEl.removeEventListener('play', playVideoInPictureMode);
                videoEl.removeEventListener('pause', pauseVideoInPictureMode);
            }
        };
    }, [videoEl, isPlay]);

    const togglePlay = function () {
        if (videoEl) {
            if (isPlay) {
                videoEl.pause()
            } else {
                if (videoEl.ended) {
                    videoEl.currentTime = 0;
                }
                videoEl.play()
            }
            setIsPlay(!isPlay)
        }
    }

    return (
        <button className="play-pause-btn" onClick={togglePlay}>
            <svg className="play-icon" viewBox="0 0 24 24" style={{display: isPlay ? "none" : "block"}}>
                <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
            </svg>
            <svg className="pause-icon" viewBox="0 0 24 24" style={{display: isPlay ? "block" : "none"}}>
                <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z"/>
            </svg>
        </button>
    )

}

function playOrPauseVideo(this: HTMLVideoElement, ev: MouseEvent) {
    throw new Error("Function not implemented.");
}
