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

interface IVideoConfigRef {
    scale: string
    prefixSegName: string
    isEndStream: boolean
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

interface ISettingOption {
    name: string,
    value: string | number
}

export type {IPlaylist, IScaleOptions, IQueueConfigRef, IViewCountConfig, IVideoConfigRef, ISettingOption}