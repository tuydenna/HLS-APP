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

export type {IPlaylist, IQueueConfigRef, IViewCountConfig, VideoConfigRef}