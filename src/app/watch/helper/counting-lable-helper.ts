import {RefObject} from "react";
import {IViewCountConfig} from "@interfaces/video-config";

function increaseWatchTime(videoEl: HTMLVideoElement, viewCountConfig: RefObject<IViewCountConfig>) {
    viewCountConfig.current.watchTime += videoEl.currentTime - viewCountConfig.current.lastTimeUpdate;
    viewCountConfig.current.lastTimeUpdate = videoEl.currentTime;
}

export {increaseWatchTime};