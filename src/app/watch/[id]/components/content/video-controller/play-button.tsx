import {RefObject, useRef, useState} from "react";
import { useParams } from 'next/navigation';
import {onDidUpdate} from "@lib/react-adapter";
import {increaseWatchTime} from "@watch/helper/counting-lable-helper";
import {IViewCountConfig} from "@interfaces/video-config";
import {videoConfig} from "@watch/helper/media-source-helper";
import PostService from "@services/post-service";

export default function PlayButton({videoEl, onSeekVideoDuration}: {videoEl: HTMLVideoElement | null, onSeekVideoDuration: Function}) {
    const [isPlay, setIsPlay] = useState(false);
    const viewCountConfig: RefObject<IViewCountConfig> = useRef({watchTime: 0, lastTimeUpdate: 0, hasCountedView: false});
    const params: {id: string} | null = useParams<{id: string}>();

    onDidUpdate(() => {
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

        async function onUpdateViewCount() {
            increaseWatchTime(videoEl!, viewCountConfig);
            if (!viewCountConfig.current.hasCountedView && viewCountConfig.current.watchTime >= videoConfig.VIEW_COUNT_DELAY) {
                viewCountConfig.current.hasCountedView = true;
                await new PostService().increaseView(params!.id)
            }
        }

        if (videoEl) {
            videoEl.addEventListener("leavepictureinpicture",togglePlay)
            videoEl.addEventListener("ended", pauseVideo)
            videoEl.addEventListener("click", togglePlay)
            videoEl.addEventListener("play", playVideoInPictureMode)
            videoEl.addEventListener("pause", pauseVideoInPictureMode)
            videoEl.addEventListener("timeupdate", onUpdateViewCount)
        }

        return () => {
            if (videoEl) {
                videoEl.removeEventListener('leavepictureinpicture', togglePlay);
                videoEl.removeEventListener('ended', pauseVideo);
                videoEl.removeEventListener('click', togglePlay);
                videoEl.removeEventListener('play', playVideoInPictureMode);
                videoEl.removeEventListener('pause', pauseVideoInPictureMode);
                videoEl.removeEventListener('timeupdate', onUpdateViewCount);
            }
        };
    }, [videoEl, isPlay]);

    const togglePlay = function () {
        if (videoEl) {
            if (isPlay) {
                increaseWatchTime(videoEl!, viewCountConfig);
                videoEl.pause();
            } else {
                if (videoEl.ended) {
                    onSeekVideoDuration(0)
                }
                viewCountConfig.current.lastTimeUpdate = videoEl.currentTime;
                videoEl.play()
            }
            setIsPlay(!isPlay)
        }
        return;
    }

    return (
        <button className="play-pause-btn contents" onClick={togglePlay}>
            <svg  width="40" height="40"  className="play-icon " viewBox="0 0 24 24" style={{display: isPlay ? "none" : "block"}}>
                <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
            </svg>
            <svg  width="40" height="40" className="pause-icon" viewBox="0 0 24 24" style={{display: isPlay ? "block" : "none"}}>
                <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z"/>
            </svg>
        </button>
    )
}

