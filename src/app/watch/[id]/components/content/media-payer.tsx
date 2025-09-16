"use client"

import "./css/media-player.css"
import {JSX, RefObject, useEffect, useRef, useState} from "react";
import DurationTimeLabel from "@watch/[id]/components/content/video-controller/duration-time-label";
import PlayButton from "@watch/[id]/components/content/video-controller/play-button";
import SoundButton from "@watch/[id]/components/content/video-controller/sound-button";
import PlayInPictureButton from "@watch/[id]/components/content/video-controller/play-in-picture-button";
import PlayInTheatreButton from "@watch/[id]/components/content/video-controller/play-in-theatre-button";
import PlayFullScreenButton from "@watch/[id]/components/content/video-controller/play-full-screen-button";
import VideoTimeline from "@watch/[id]/components/content/video-controller/video-timeline";
import {
    canPreFetchSegment, clearSourceBuffer,
    closeStreamSegmentIfPossible, getAndPlusOneSegmentIndex,
    getIsSeeking,
    initMediaSourceExtension,
    initSourceBuffer, isBeginSeekToNewPosition, isEndStream, isIOS,
    isMediaSourceSupported, logMediaEncoderError, resetIsEndStream,
    setInitVideoDuration,
    setIsFetchingChunk,
    setIsSeeking,
    videoConfig
} from "@watch/helper/media-source-helper";
import {IQueueConfigRef, IVideoConfigRef} from "@interfaces/video-config";
import SpinnerIndicator from "@watch/[id]/components/content/extentsion/spinner-indicator";
import {ErrorException} from "@interfaces/error-exeption";
import {IVideo} from "@interfaces/video";
import StreamService from "@services/stream-service";
import SettingButton from "@watch/[id]/components/content/video-controller/setting-button";

export default function MediaPayer(data: {video: IVideo}):JSX.Element {

    const videoRef: RefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement>(null)
    const mediaSourceRef: RefObject<MediaSource | null> = useRef<MediaSource>(null)
    const sourceBufferRef: RefObject<SourceBuffer | null> = useRef<SourceBuffer>(null)
    const queueConfigRef: RefObject<IQueueConfigRef> = useRef({segmentEnd: 0, isFetchingChunk: false, isSeeking: false})
    const videoConfigRef: RefObject<IVideoConfigRef> = useRef({scale: "360p", prefixSegName: "seg_", isEndStream: false})
    const fileSegmentCurrentIndexRef: RefObject<number> = useRef(0)
    const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
    const streamService: StreamService = new StreamService();

    const fetchAndAppendBuffer = async function (sourceBuffer: SourceBuffer, fileSegment: string): Promise<string | undefined> {
        let retryCount: number = 0;
        const retry = async function (): Promise<string | undefined> {
            try {
                const chunk: ArrayBuffer | null = await streamService.getSegmentFileBuffer(data.video.id, fileSegment);

                if (chunk == null) {
                    mediaSourceRef.current?.endOfStream();
                    videoConfigRef.current.isEndStream = true;
                    console.warn("[fetchAndAppendBuffer]: stream is ended!");
                    return;
                }

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
                const res = await streamService.getSeekingSegmentFileBuffer(data.video.id, currentTime, videoConfigRef.current.scale);
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
        // Config for IOS
        if (isIOS(videoConfig.MIME_CODEC)) {
            videoEl!.currentTime = currentTime;
            return;
        }

        //Already Ended video stream
        if (isEndStream(videoConfigRef)) {
            console.log("[handleSeekVideoDuration]:", "isEndStream");
            return reopenMediaSourceEvent(currentTime);
        }

        streamService.abortOngoingStream();
        setIsSeeking(queueConfigRef);
        setIsFetchingChunk(queueConfigRef, false);

        let sourceBuffer: SourceBuffer | null = sourceBufferRef.current;

        if (sourceBuffer) {
            if (sourceBuffer.updating) {
                sourceBuffer.abort()
                console.warn("aborting");
            }

            if (sourceBuffer.buffered.length) {
                const bufferEndTime: number = sourceBuffer.buffered.end(sourceBuffer.buffered!.length - 1)
                const bufferStartTime: number = sourceBuffer.buffered.start(0)

                if (bufferStartTime <= currentTime && bufferEndTime >= currentTime) {
                    videoEl!.currentTime = currentTime;
                    setIsSeeking(queueConfigRef, false)
                    return
                }

                clearSourceBuffer(sourceBuffer);

                sourceBuffer.addEventListener("updateend", async () => {
                    videoEl!.currentTime = currentTime;
                    await fetchSeekingAndAppendBuffer(sourceBuffer, currentTime);
                    setIsSeeking(queueConfigRef, false);
                }, {once: true});
            }

        } else {
            console.error("[sourceBuffer]: is null", sourceBuffer)
        }
    }

    const handleChangeVideoScale = async (): Promise<void> => {
        const currentTime: number = videoEl!.currentTime;

        if (isIOS(videoConfig.MIME_CODEC)) {
            videoEl!.src = streamService.getPlaylistEndPoint(data.video.id, videoConfigRef.current.scale);
            videoEl!.currentTime = currentTime;
            videoEl!.load();
            return;
        }

        streamService.abortOngoingStream();
        setIsSeeking(queueConfigRef);
        setIsFetchingChunk(queueConfigRef, false);

        let sourceBuffer: SourceBuffer | null = sourceBufferRef.current;

        if (sourceBuffer) {
            if (sourceBuffer.updating) {
                sourceBuffer.abort()
                console.warn("aborting");
            }

            clearSourceBuffer(sourceBuffer);

            sourceBuffer.addEventListener("updateend", async () => {
                await fetchAndAppendBuffer(sourceBuffer, getParamSegmentFilePath("init.mp4"));
                await fetchSeekingAndAppendBuffer(sourceBuffer, currentTime);

                sourceBufferRef.current = sourceBuffer;

                setIsSeeking(queueConfigRef, false);
                await prefetchSegmentChunkBuffer();

                videoEl!.currentTime = currentTime;

                console.log("[handleSeekVideoDuration]: ", sourceBuffer.buffered.length, sourceBuffer.buffered.start(0), sourceBuffer.buffered.end(0));
            }, {once: true});
        } else {
            console.error("[sourceBuffer]: is null", sourceBuffer)
        }
    }

    const prefetchSegmentChunkBuffer = async function () {
        if (!getIsSeeking(queueConfigRef) && canPreFetchSegment(queueConfigRef, sourceBufferRef, {currentTime: videoRef.current!.currentTime, videoSize: data.video.size})) {
            setIsFetchingChunk(queueConfigRef)
            await fetchAndAppendBuffer(sourceBufferRef.current!, getParamSegmentFilePath());
            // console.log("[prefetchSegmentChunkBuffer]:", sourceBufferRef.current?.buffered.length)
        } else {
            console.warn("[prefetchSegmentChunkBuffer]: no permission!")
        }
    }

    const getParamSegmentFilePath = function (segmentName?: string): string {
        return  segmentName ? `${segmentName}?scale=${videoConfigRef.current.scale}` : `${videoConfigRef.current.prefixSegName + fileSegmentCurrentIndexRef.current}.m4s?scale=${videoConfigRef.current.scale}`;
    }

    const reopenMediaSourceEvent = async (currentTime: number = 0): Promise<void> => {
        let sourceBuffer: SourceBuffer | null = sourceBufferRef.current;

        if (sourceBuffer) {
            if (sourceBuffer.updating) {
                sourceBuffer.abort()
                console.warn("aborting");
            }
            clearSourceBuffer(sourceBuffer);
        }
        videoEl!.currentTime = currentTime;
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
            resetIsEndStream(videoConfigRef);

            // Seeking to new position
            if (isBeginSeekToNewPosition(videoEl)) {
                videoEl!.pause()
                await fetchSeekingAndAppendBuffer(sourceBuffer, videoEl!.currentTime);
                console.log("[isBeginSeekToNewPosition]:", fileSegmentCurrentIndexRef.current)
                return;
            }

            await fetchAndAppendBuffer(sourceBuffer, getParamSegmentFilePath("init.mp4"));
            fileSegmentCurrentIndexRef.current = 0;
            await fetchAndAppendBuffer(sourceBuffer, getParamSegmentFilePath());
        }

        if (videoEl) {
            if (isIOS(videoConfig.MIME_CODEC)) {
                videoEl.src = streamService.getPlaylistEndPoint(data.video.id, videoConfigRef.current.scale);
                videoEl.preload = "metadata";
            } else {
                const mediaSource: MediaSource = initMediaSourceExtension(videoEl);
                mediaSourceRef.current = mediaSource;
                mediaSource.addEventListener('sourceopen', createBufferPipelineAndInitSegmentMetadata);
                videoEl.addEventListener("timeupdate", prefetchSegmentChunkBuffer);
                videoEl.addEventListener("error", logMediaEncoderError)
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
        <div className="max-h-[55vw]! md:max-h-[37vw]! video-container paused m-0 mb-3 full-screen" id="video-container"  data-volume-level="high">
            <img className="thumbnail-img" alt={"f"}/>
            <SpinnerIndicator videoEl={videoEl}/>
            <div className="video-controls-container">
                <VideoTimeline videoEl={videoEl} sourceBufferRef={sourceBufferRef} onSeekVideoDuration={handleSeekVideoDuration} />
                <div className="controls">
                    <PlayButton videoEl={videoEl} handleReplay={reopenMediaSourceEvent}/>
                    <SoundButton videoEl={videoEl}/>
                    <DurationTimeLabel videoEl={videoEl}/>
                    <SettingButton data={data.video} videoEl={videoEl} videoConfigRef={videoConfigRef} handleChangeVideoScale={handleChangeVideoScale}/>
                    <PlayInPictureButton videoEl={videoEl}/>
                    <PlayInTheatreButton videoEl={videoEl}/>
                    <PlayFullScreenButton videoEl={videoEl}/>
                </div>
            </div>
            <video ref={videoRef} playsInline={true} controls={false} autoPlay={true} muted={false} preload={"metadata"}>
                <track kind="captions" srcLang="en" src="/media_player/assets/subtitles.vtt"/>
            </video>
        </div>
    )
}
