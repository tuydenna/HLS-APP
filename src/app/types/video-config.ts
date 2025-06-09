interface ISegment {
    start: number;
    end: number;
}

interface IQueueConfigRef {
    segmentEnd: number,
    isFetchingChunk: boolean,
    isSeeking: boolean,
}

export type {ISegment, IQueueConfigRef}