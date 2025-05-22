"use client"

import "./media-player.css"
import {JSX, RefObject, useEffect, useRef, useState} from "react";
import DurationTimeLabel from "@display/[id]/components/video-controller/duration-time-label";
import PlayButton from "@display/[id]/components/video-controller/play-button";
import SoundButton from "@display/[id]/components/video-controller/sound-button";
import PlayBackRateButton from "@display/[id]/components/video-controller/play-back-rate-button";
import PlayInPictureButton from "@display/[id]/components/video-controller/play-in-picture-button";
import PlayInTheatreButton from "@display/[id]/components/video-controller/play-in-theatre-button";
import PlayFullScreenButton from "@display/[id]/components/video-controller/play-full-screen-button";
import VideoTimeline from "@display/[id]/components/video-controller/video-timeline";

export default function MediaPayer(data: {video: {path: string}}):JSX.Element {

    const videoRef: RefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement>(null)
    const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)

    useEffect(() => {
        if (videoRef.current) {
            setVideoEl(videoRef.current)
        }
    }, [videoRef]);

    return (
        <div className="video-container paused m-0 mb-3" data-volume-level="high">
            <img className="thumbnail-img" alt={"f"}/>
            <div className="video-controls-container">
                <VideoTimeline videoEl={videoEl}/>
                <div className="controls">
                    <PlayButton videoEl={videoEl}/>
                    <SoundButton videoEl={videoEl}/>
                    <DurationTimeLabel videoEl={videoEl}/>
                    <button className="captions-btn">
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"/>
                        </svg>
                    </button>
                    <PlayBackRateButton videoEl={videoEl}/>
                    <PlayInPictureButton videoEl={videoEl}/>
                    <PlayInTheatreButton videoEl={videoEl}/>
                    <PlayFullScreenButton videoEl={videoEl}/>
                </div>
            </div>
            <video ref={videoRef} src={`http://localhost:3080/api/streaming/videos/${encodeURIComponent(data.video.path)}`} autoPlay={true} muted={true}>
                <track kind="captions" srcLang="en" src="/media_player/assets/subtitles.vtt"/>
            </video>
        </div>
    )
}