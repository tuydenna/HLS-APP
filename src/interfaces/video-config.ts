interface IPlaylist {
    fileName: string;
    start: number;
    duration: number;
}

interface IQueueConfigRef {
    segmentEnd: number,
    isFetchingChunk: boolean,
    isSeeking: boolean,
}

interface VideoConfigRef {
    scale: string
    prefixSegName: string
}

interface IViewCountConfig {
    watchTime: number
    lastTimeUpdate: number
    hasCountedView: boolean
}

interface IScaleOptions {
    readonly "360p": "360p"
    readonly "720p": "720p"
    readonly "1080p": "1080p"
}

export type {IPlaylist, IScaleOptions, IQueueConfigRef, IViewCountConfig, VideoConfigRef}