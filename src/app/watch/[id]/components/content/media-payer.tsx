"use client"

import "./css/media-player.css"
import {JSX, RefObject, useEffect, useRef, useState} from "react";
import DurationTimeLabel from "@watch/[id]/components/content/video-controller/duration-time-label";
import PlayButton from "@watch/[id]/components/content/video-controller/play-button";
import SoundButton from "@watch/[id]/components/content/video-controller/sound-button";
import PlayBackRateButton from "@watch/[id]/components/content/video-controller/play-back-rate-button";
import PlayInPictureButton from "@watch/[id]/components/content/video-controller/play-in-picture-button";
import PlayInTheatreButton from "@watch/[id]/components/content/video-controller/play-in-theatre-button";
import PlayFullScreenButton from "@watch/[id]/components/content/video-controller/play-full-screen-button";
import VideoTimeline from "@watch/[id]/components/content/video-controller/video-timeline";
import {
    canPreFetchSegment,
    closeStreamSegmentIfPossible, getAndPlusOneSegmentIndex,
    getIsSeeking,
    initMediaSourceExtension,
    initSourceBuffer,
    isMediaSourceSupported, logMediaEncoderError,
    setInitVideoDuration,
    setIsFetchingChunk,
    setIsSeeking,
    videoConfig
} from "@watch/helper/media-source-helper";
import {IQueueConfigRef} from "@interfaces/video-config";
import SpinnerIndicator from "@watch/[id]/components/content/extentsion/spinner-indicator";
import {ErrorException} from "@interfaces/error-exeption";
import {IVideo} from "@interfaces/video";
import StreamService from "@services/stream-service";

export default function MediaPayer(data: {video: IVideo}):JSX.Element {

    const videoRef: RefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement>(null)
    const mediaSourceRef: RefObject<MediaSource | null> = useRef<MediaSource>(null)
    const sourceBufferRef: RefObject<SourceBuffer | null> = useRef<SourceBuffer>(null)
    const queueConfigRef: RefObject<IQueueConfigRef> = useRef({segmentEnd: 0, isFetchingChunk: false, isSeeking: false})
    const fileSegmentCurrentIndexRef: RefObject<number> = useRef(0)
    const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
    const prefixSegName: string = "seg_";
    const streamService: StreamService = new StreamService();

    const fetchAndAppendBuffer = async function (sourceBuffer: SourceBuffer, fileSegment: string): Promise<string | undefined> {
        let retryCount: number = 0;
        const retry = async function (): Promise<string | undefined> {
            try {
                const chunk: ArrayBuffer = await streamService.getSegmentFileBuffer(data.video.id, fileSegment);
                console.log(chunk.toString());
                return await new Promise((resolve, reject) => {
                    if (sourceBuffer && !sourceBuffer.updating) {
                        sourceBuffer?.appendBuffer(chunk);
                    }
                    sourceBuffer?.addEventListener('updateend', function () {
                        console.log(`[fetchAndAppendBuffer]: sourceBuffer is updated Segment : ${fileSegment}`);
                        setIsFetchingChunk(queueConfigRef, false)
                        closeStreamSegmentIfPossible(mediaSourceRef, queueConfigRef, data.video.size);
                        fileSegmentCurrentIndexRef.current += 1
                        resolve("successes");
                    }, {once: true});
                });
            } catch (e: ErrorException | unknown) {
                if (e instanceof ErrorException) {
                    if (e.code == 404) {
                        mediaSourceRef.current?.endOfStream();
                        console.error("[fetchAndAppendBufferV2]: ", e);
                        return;
                    }
                    if (retryCount <= 5) {
                        retryCount++;
                        return await retry()
                    }
                    return;
                }
            }
        }
        return await retry()
    }

    const fetchSeekingAndAppendBuffer = async function (sourceBuffer: SourceBuffer, currentTime:  number): Promise<string | undefined> {
        let retryCount: number = 0;
        const retry = async function (): Promise<string | undefined> {
            try {
                const res = await streamService.getSeekingSegmentFileBuffer(data.video.id, currentTime);
                return await new Promise((resolve, reject) => {
                    if (sourceBuffer && !sourceBuffer.updating) {
                        sourceBuffer?.appendBuffer(res.buffer);
                    }
                    sourceBuffer?.addEventListener('updateend', function () {
                        console.log(`[fetchAndAppendBuffer]: sourceBuffer is updated Segment : ${res.fileSegment}`);
                        setIsFetchingChunk(queueConfigRef, false)
                        closeStreamSegmentIfPossible(mediaSourceRef, queueConfigRef, data.video.size);
                        fileSegmentCurrentIndexRef.current = getAndPlusOneSegmentIndex(res.fileSegment!);
                        resolve("successes");
                    }, {once: true});
                });
            } catch (e: ErrorException | unknown) {
                if (e instanceof ErrorException) {
                    if (e.code == 404) {
                        mediaSourceRef.current?.endOfStream();
                        console.error("[fetchAndAppendBufferV2]: ", e);
                        return;
                    }
                    if (retryCount <= 5) {
                        retryCount++;
                        return await retry()
                    }
                    return;
                }
            }
        }
        return await retry()
    }

    const handleSeekVideoDuration = async (currentTime: number): Promise<void> => {
        setIsSeeking(queueConfigRef);
        setIsFetchingChunk(queueConfigRef, false);

        let sourceBuffer = sourceBufferRef.current;

        if (sourceBuffer) {
            if (sourceBuffer.updating) {
                sourceBuffer.abort()
                console.warn("aborting");
            }

            const bufferEndTime: number = sourceBuffer.buffered.end(sourceBuffer.buffered!.length - 1)
            const bufferStartTime: number = sourceBuffer.buffered.start(0)

            if (bufferStartTime <= currentTime && bufferEndTime >= currentTime) {
                videoEl!.currentTime = currentTime;
                setIsSeeking(queueConfigRef, false)
                return
            }

            sourceBuffer.remove(bufferStartTime, bufferEndTime);
            sourceBuffer.addEventListener("updateend", async () => {
                videoEl!.currentTime = currentTime;
                await fetchSeekingAndAppendBuffer(sourceBuffer, currentTime)
                setIsSeeking(queueConfigRef, false)
                console.log("[handleSeekVideoDuration]: ", sourceBuffer.buffered.length, sourceBuffer.buffered.start(0), sourceBuffer.buffered.end(0));
            }, {once: true});
        } else {
            console.error("[sourceBuffer]: is null", sourceBuffer)
        }
    }

    async function prefetchSegmentChunkBuffer() {
        if (!getIsSeeking(queueConfigRef) && canPreFetchSegment(queueConfigRef, sourceBufferRef, {currentTime: videoRef.current!.currentTime, videoSize: data.video.size})) {
            console.log("[prefetchSegmentChunkBuffer]");
            setIsFetchingChunk(queueConfigRef)
            await fetchAndAppendBuffer(sourceBufferRef.current!, `${prefixSegName}${fileSegmentCurrentIndexRef.current}.m4s`);
            console.log("[prefetchSegmentChunkBuffer]:", sourceBufferRef.current?.buffered.length)
        } else {
            console.warn("[prefetchSegmentChunkBuffer]: no permission!")
        }
    }

    useEffect(() => {

        if (!videoRef.current) return;
        setVideoEl(videoRef.current);

        const createBufferPipelineAndInitSegmentMetadata = async function () {

            console.log("sourceopening start segmenting", mediaSourceRef.current!.readyState);

            if (!isMediaSourceSupported(videoConfig.MIME_CODEC)) {
                console.error("MediaSource is not supported");
                return
            }

            const sourceBuffer: SourceBuffer = initSourceBuffer(mediaSourceRef.current!);
            sourceBufferRef.current = sourceBuffer;
            setInitVideoDuration(mediaSourceRef.current!, data.video.duration)

            await fetchAndAppendBuffer(sourceBuffer, "init.mp4");
            fileSegmentCurrentIndexRef.current = 0;
            await fetchAndAppendBuffer(sourceBuffer, `${prefixSegName}${fileSegmentCurrentIndexRef.current}.m4s`);
        }

        if (videoEl) {
            if (isMediaSourceSupported(videoConfig.MIME_CODEC)) {
                const mediaSource: MediaSource = initMediaSourceExtension(videoEl);
                mediaSourceRef.current = mediaSource;
                mediaSource.addEventListener('sourceopen', createBufferPipelineAndInitSegmentMetadata);
                videoEl.addEventListener("timeupdate", prefetchSegmentChunkBuffer);
                videoEl.addEventListener("error", logMediaEncoderError)
            } else {
                videoEl.src = streamService.getPlaylistEngPoint(data.video.id)
                videoEl.preload = "metadata";
                // videoEl.src = "/video/playlist.m3u8"
            }
        }

        console.warn("User Effect Called");

        return () => {
            if (videoEl) {
                videoEl.removeEventListener("timeupdate", prefetchSegmentChunkBuffer);
                videoEl.removeEventListener("error", logMediaEncoderError);
            }
            if (mediaSourceRef.current) {
                mediaSourceRef.current.removeEventListener("sourceopen", createBufferPipelineAndInitSegmentMetadata)
            }
        }
    }, [videoRef.current]);

    return (
        <div className="video-container paused m-0 mb-3 full-screen" data-volume-level="high">
            <img className="thumbnail-img" alt={"f"}/>
            <SpinnerIndicator videoEl={videoEl}/>
            <div className="video-controls-container">
                <VideoTimeline videoEl={videoEl} sourceBufferRef={sourceBufferRef} onSeekVideoDuration={handleSeekVideoDuration} />
                <div className="controls">
                    <PlayButton videoEl={videoEl} onSeekVideoDuration={handleSeekVideoDuration}/>
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
            <video ref={videoRef} playsInline={true} controls={false} autoPlay={false} muted={true} preload={"metadata"}>
                {/*<source src={"http://192.168.100.53:3080/api/streams/fmp4/playlist"} type="application/vnd.apple.mpegurl" />*/}
                <track kind="captions" srcLang="en" src="/media_player/assets/subtitles.vtt"/>
            </video>
        </div>
    )
}