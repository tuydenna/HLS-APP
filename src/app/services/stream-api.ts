
const endPoint: string = "/stream-segment"

function getBaseAPI(endUrl: string  = ""): string {
    return  process.env.NEXT_PUBLIC_DEV_API + endPoint + ( endUrl ?  "/" + endUrl : "") ;
}

async function getSegmentBuffer(video_path: string, range: string) {
    return (
        await fetch(
            getBaseAPI(video_path),
            { headers: { Range: range } }
    ).then(res => res.arrayBuffer()))
}

async function getSegmentFileBuffer(segmentFile: string) {
    const res = await fetch(getBaseAPI("fmp4/"+ segmentFile));
    if (!res.ok) {
       throw new Error((await res.json()).message);
    }
    return (await res.arrayBuffer());
}

async function getSeekRangeHeader(currentTime: number) {
    return (
        await fetch(
            getBaseAPI("seekable-range/" + currentTime),
    ).then(res => res.json())).data
}

export {getSegmentBuffer, getSeekRangeHeader, getSegmentFileBuffer}
