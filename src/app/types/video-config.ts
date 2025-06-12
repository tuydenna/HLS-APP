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

export type {IPlaylist, IQueueConfigRef}