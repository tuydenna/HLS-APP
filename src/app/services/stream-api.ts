import {ErrorException} from "@app/types/error-exeption";

const endPoint: string = "/stream-segment"

function getBaseAPI(endUrl: string  = ""): string {
    return  process.env.NEXT_PUBLIC_DEV_API + endPoint + ( endUrl ?  "/" + endUrl : "") ;
}

async function getSegmentFileBuffer(videoId: string, segmentFile: string) {
    const res = await fetch(getBaseAPI("fmp4/" + videoId + "/" + segmentFile));
    if (!res.ok) {
        const json = await res.json();
        throw new ErrorException(res.status, json.message);
    }
    return (await res.arrayBuffer());
}

async function getSeekingSegmentFileBuffer(videoId: string, currentTime: number): Promise<{fileSegment: string | null, buffer: ArrayBuffer}> {
    const res = await fetch(getBaseAPI("fmp4/seeks/" + videoId + "/" + currentTime));
    if (!res.ok) {
        const json = await res.json();
        throw new ErrorException(res.status, json.message);
    }

    return {fileSegment: res.headers.get("X-Segment-Name"), buffer: (await res.arrayBuffer())};
}

export {getSegmentFileBuffer,getSeekingSegmentFileBuffer}
