"use client"

import "./css/media-player.css"
import {JSX, RefObject, useCallback, useEffect, useRef, useState} from "react";
import DurationTimeLabel from "@display/[id]/components/content/video-controller/duration-time-label";
import PlayButton from "@display/[id]/components/content/video-controller/play-button";
import SoundButton from "@display/[id]/components/content/video-controller/sound-button";
import PlayBackRateButton from "@display/[id]/components/content/video-controller/play-back-rate-button";
import PlayInPictureButton from "@display/[id]/components/content/video-controller/play-in-picture-button";
import PlayInTheatreButton from "@display/[id]/components/content/video-controller/play-in-theatre-button";
import PlayFullScreenButton from "@display/[id]/components/content/video-controller/play-full-screen-button";
import VideoTimeline from "@display/[id]/components/content/video-controller/video-timeline";

const MIME_CODEC  = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

const isMediaSourceSupported = (mimeCodec: string) => {
    // return 'MIME_CODEC ' in window && MediaSource.isTypeSupported(mimeCodec);
    return MediaSource.isTypeSupported(mimeCodec);
};

export default function MediaPayer(data: {video: {path: string}}):JSX.Element {

    const videoRef: RefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement>(null)
    const mediaSourceRef: RefObject<MediaSource | null> = useRef<MediaSource>(null)
    const sourceBufferRef: RefObject<SourceBuffer | null> = useRef<SourceBuffer>(null)
    const segmentOffsetRef = useRef(0);
    const videoTotalSizeRef = useRef(0);
    const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
    const [bufferedRanges, setBufferedRanges] = useState(null);

    const appendToSourceBuffer = useCallback(async (buffer: ArrayBuffer) => {
        if (!sourceBufferRef.current || sourceBufferRef.current.updating) {
            // If SourceBuffer is not ready or is busy, wait and retry
            return new Promise(resolve => {
                const retryAppend = () => {
                    if (sourceBufferRef.current && !sourceBufferRef.current.updating) {
                        sourceBufferRef.current.appendBuffer(buffer);
                        resolve(true);
                    } else {
                        setTimeout(retryAppend, 50); // Retry after a short delay
                    }
                };
                retryAppend();
            });
        }
        sourceBufferRef.current.appendBuffer(buffer);
        return new Promise(resolve => {
            sourceBufferRef?.current!.addEventListener('updateend', resolve, { once: true });
        });
    }, []);

    const fetchAndAppendNextSegment = useCallback(async () => {
        const videoTotalSize = 73379031
        if (!sourceBufferRef.current ) {
            return;
        }
        // isFetchingRef.current = true;
        // setIsLoading(true);
        const apiURLSegment = `http://localhost:3080/api/stream-segment/${encodeURIComponent(data.video.path)}`
        const chunkSize = 10 * 10 ** 6; // 1MB chunk size, adjust as needed
        const start = segmentOffsetRef.current;
        const end = Math.min(start + chunkSize - 1, vnideoTotalSize - 1);

        try {
            console.log(`Workspaceing segment: bytes=${start}-${end}`);
            const response: Response = await fetch(`${apiURLSegment}/?start=${start}&end=${end}`, {
                headers: {
                    'Range': `bytes=${start}-${end}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ArrayBuffer = await response.arrayBuffer();
            await appendToSourceBuffer(data);

            segmentOffsetRef.current = end + 1; // Update offset for next fetch

            // Update buffered ranges for display
            if (videoRef.current && sourceBufferRef.current) {
                // @ts-ignore
                setBufferedRanges(sourceBufferRef.current.buffered);
            }

            if (segmentOffsetRef.current >= videoTotalSize) {
                mediaSourceRef.current?.endOfStream();
                // setIsLoading(false);
                console.log('All segments appended. End of stream.');
            }

        } catch (err: any) {
            console.error('Error fetching or appending media segment:', err);
            console.error((`Streaming error: ${err.message}`));
            // setIsLoading(false);
            mediaSourceRef.current?.endOfStream('network'); // Signal error to MediaSource
        } finally {
            // isFetchingRef.current = false;
        }
    }, [appendToSourceBuffer]);

    const handleProgress = (e) => {
        console.log("handleProgress", e);
        if (sourceBufferRef.current) {
            // @ts-ignore
            setBufferedRanges(sourceBufferRef.current.buffered);
        }
        // Add logic here to fetch more segments based on buffered amount
        // For example, if currentTime + X seconds is not buffered, fetch more
        const bufferThreshold = 10; // seconds
        // if (video.currentTime + bufferThreshold > video.buffered.end(video.buffered.length - 1)) {
        //     fetchAndAppendNextSegment();
        // }
    };

    // useEffect(() => {
    //     const videoEl:  HTMLVideoElement | null = videoRef.current;
    //     if (!videoEl) return;
    //
    //     if (!isMediaSourceSupported(MIME_CODEC)) {
    //         console.error(`MediaSource or codec '${MIME_CODEC}' is not supported by this browser.`);
    //         return;
    //     }
    //
    //     const mediaSource: MediaSource = new MediaSource();// Store MediaSource in ref
    //     mediaSourceRef.current = mediaSource;
    //     videoEl.src = URL.createObjectURL(mediaSource);
    //     setVideoEl(videoRef.current);
    //
    //     const apiURL = `http://localhost:3080/api/stream-segment/init/${encodeURIComponent(data.video.path)}`
    //
    //     const handleSourceOpen = async () => {
    //         console.log('MediaSource opened.');
    //         try {
    //             // Add SourceBuffer
    //             sourceBufferRef.current = mediaSource.addSourceBuffer(MIME_CODEC); // Store SourceBuffer in ref
    //
    //             // Fetch and append Initialization Segment
    //             console.log('Fetching initialization segment...');
    //             const initSegmentData: ArrayBuffer = await fetch(apiURL).then(res => res.arrayBuffer());
    //             await appendToSourceBuffer(initSegmentData); // Append init segment
    //
    //             console.log('Initialization segment appended.');
    //             segmentOffsetRef.current = initSegmentData.byteLength; // Set offset after init segment
    //
    //             // Start fetching and appending media segments
    //             await fetchAndAppendNextSegment();
    //
    //         } catch (err) {
    //             console.error('Error during sourceopen setup:', err);
    //             console.error(`Setup error: ${err.message}`);
    //             // setIsLoading(false);
    //             mediaSource.endOfStream('decode'); // Signal error
    //         }
    //     };
    //
    //     const canPlay = () => {
    //         console.log("videoEl.readyState === 'open'", videoEl.readyState);
    //         if (videoEl.readyState === 'open') {
    //             videoEl.removeEventListener('canplay', canPlay);
    //             videoEl.play();
    //         }
    //     }
    //     console.log("sourceopen");
    //     mediaSource.addEventListener('sourceopen', handleSourceOpen);
    //     videoEl.addEventListener('canplay',canPlay);
    //     videoEl.addEventListener('canplaythrough',canPlay);
    //     videoEl.addEventListener('error', handleProgress);
    //
    //     return () => {
    //         if (mediaSource) {
    //             mediaSource.removeEventListener('sourceopen', handleSourceOpen);
    //             if (mediaSource.readyState !== 'closed') {
    //                 URL.revokeObjectURL(videoEl.src); // Revoke URL to release resources
    //             }
    //         }
    //     }
    //     // mediaSource.addEventListener('sourceopen', async function () {
    //     //     const sourceBuffer: SourceBuffer = mediaSource.addSourceBuffer(mime);
    //     //
    //     //     const detail = await fetch(apiURL).then(res => res.json())
    //     //     console.log("sourceopen", detail);
    //     //
    //     //     let segmentRank: number = 1;
    //     //
    //     //     const fetchChuckSegment = async function () {
    //     //         const segmentBuffer: ArrayBuffer = await fetch(apiURLSegment + "?segment=" + segmentRank).then(res => res.arrayBuffer());
    //     //
    //     //         if (!sourceBuffer.updating) {
    //     //             sourceBuffer.appendBuffer(segmentBuffer);
    //     //         }
    //     //     }
    //     //
    //     //     sourceBuffer.addEventListener("updateend",async function () {
    //     //         console.log("readyState", mediaSource.readyState);
    //     //         if (mediaSource.readyState === "open" && !sourceBuffer.updating) {
    //     //             segmentRank++;
    //     //             await fetchChuckSegment()
    //     //         }
    //     //     })
    //     //
    //     //     await fetchChuckSegment()
    //     //
    //     //     })
    //     //     videoRef.current.addEventListener('canplay', () => {
    //     //         alert("canplay")
    //     //     });
    // }, [videoRef, appendToSourceBuffer, fetchAndAppendNextSegment]);

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
            {/*<video ref={videoRef} controls={true} autoPlay={false} muted={true}>*/}
            {/*    <track kind="captions" srcLang="en" src="/media_player/assets/subtitles.vtt"/>*/}
            {/*</video>*/}
            <video ref={videoRef} src={`http://localhost:3080/api/streaming/videos/${encodeURIComponent(data.video.path)}`} autoPlay={true} muted={true}>
                <track kind="captions" srcLang="en" src="/media_player/assets/subtitles.vtt"/>
            </video>
        </div>
    )
}