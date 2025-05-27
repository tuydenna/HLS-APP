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
import {getSegmentBuffer} from "@app/services/stream-api";

const MIME_CODEC  = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

const isMediaSourceSupported = (mimeCodec: string) => {
    // return 'MIME_CODEC ' in window && MediaSource.isTypeSupported(mimeCodec);
    return MediaSource.isTypeSupported(mimeCodec);
};

export default function MediaPayer(data: {video: {path: string}}):JSX.Element {

    const videoRef: RefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement>(null)
    const mediaSourceRef: RefObject<MediaSource | null> = useRef<MediaSource>(null)
    const sourceBufferRef: RefObject<SourceBuffer | null> = useRef<SourceBuffer>(null)
    const segmentIndexRef = useRef(0);
    const isFetchingChunkRef = useRef(false);
    const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
    const [bufferedRanges, setBufferedRanges] = useState(null);
    const mime_type: string = 'video/mp4; codecs="avc1.64002A, mp4a.40.2"';

    const fetchAndAppendBuffer = async function (sourceBuffer: SourceBuffer, segment: any): Promise<boolean> {
        console.log(
            `Segment ${segmentIndexRef.current}: ${segment.start} - ${segment.end ?? 'end'}`
        )
        const range = `bytes=${segment.start}-${segment.end ?? ''}`;
        const chunk: ArrayBuffer = await getSegmentBuffer(encodeURIComponent(data.video.path), range);

        return await new Promise((resolve, reject) => {
            if (!(sourceBuffer && sourceBuffer.updating)) {
                sourceBuffer?.appendBuffer(chunk);
            }
            sourceBuffer?.addEventListener('updateend', function () {
                console.log("sourceBuffer is updated");
                segmentIndexRef.current += 1;
                isFetchingChunkRef.current = false;
                resolve(true);
            }, {once: true});
            sourceBuffer?.addEventListener('error', function (e) {
                reject(false);
                console.error("sourceBuffer is error", e);
            }, {once: true});
            sourceBuffer?.addEventListener('abort', function () {
                console.error("sourceBuffer is abort")
                reject(false);
            }, {once: true});
        });
    }


    useEffect(() => {
        async function sourceOpenConnectBufferingAndInitSegment() {
            console.log("sourceopening start segmenting", mediaSourceRef.current!.readyState);
            mediaSourceRef.current.duration = 120;
            const manifest =  (await import("@display/manifest.json")).default
            if (!MediaSource.isTypeSupported(mime_type)) {
                console.error("MediaSource is not supported");
                return
            }

            const sourceBuffer: SourceBuffer = mediaSourceRef.current!.addSourceBuffer(mime_type);
            sourceBufferRef.current = sourceBuffer;

            // Init Segment data
            await fetchAndAppendBuffer(sourceBuffer, manifest[segmentIndexRef.current]);
            await fetchAndAppendBuffer(sourceBuffer, manifest[segmentIndexRef.current]);
        }

        async function prefetchSegmentChunkBuffer() {
            const sourceBuffer: SourceBuffer | null = sourceBufferRef.current;
            if (sourceBuffer) {
                const advanceBufferTime = 5;
                const bufferedDuration: number = sourceBuffer?.buffered.end(sourceBuffer.buffered!.length - 1) || 0
                const currentTime: number | undefined = videoRef.current?.currentTime;
                if (!isFetchingChunkRef.current && currentTime && (currentTime + advanceBufferTime >= bufferedDuration)) {
                    // @ts-ignore
                    const manifest: {start: number, end: number, type: string}[] = (await import("@display/manifest.json")).default
                    isFetchingChunkRef.current = true;
                    await fetchAndAppendBuffer(sourceBuffer, manifest[segmentIndexRef.current]);
                    console.warn("timeupdate", bufferedDuration, currentTime,  sourceBuffer);
                }
            } else {
                console.error("sourceBuffer is null");
            }
        }

        const run = async () => {

            mediaSourceRef.current = new MediaSource();
            videoRef.current!.src = URL.createObjectURL(mediaSourceRef.current);

            mediaSourceRef.current.addEventListener('sourceopen', sourceOpenConnectBufferingAndInitSegment);

            videoRef.current?.addEventListener("timeupdate", prefetchSegmentChunkBuffer)
        };
        if (videoRef.current) {
            run();
            setVideoEl(videoRef.current);
        }

        console.warn("User Effect Called");

        return () => {
            if (videoRef.current) {
                videoRef.current?.removeEventListener("timeupdate", prefetchSegmentChunkBuffer)
            }
            if (mediaSourceRef.current) {
                mediaSourceRef.current.removeEventListener("sourceopen", sourceOpenConnectBufferingAndInitSegment)
            }
        }
    }, [videoRef.current, mediaSourceRef]);

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
            <video ref={videoRef} controls={true} autoPlay={false} muted={true}>
                <track kind="captions" srcLang="en" src="/media_player/assets/subtitles.vtt"/>
            </video>
        </div>
    )
}