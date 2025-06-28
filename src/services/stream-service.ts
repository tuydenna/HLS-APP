import BaseService, {fetchAdapter} from "./base-service";
import {ErrorException} from "@interfaces/error-exeption";

export default class StreamService extends BaseService<null> {

    constructor() {
        super("/streams/fmp4");
    }

    async getSegmentFileBuffer(videoId: string, segmentFile: string): Promise<ArrayBuffer> {
        const res = await fetchAdapter.get(this.getBaseAPI(videoId + "/" + segmentFile), this.getHeaders());
        if (!res.ok) {
            const json = await res.json();
            throw new ErrorException(res.status, json.message);
        }
        return (await res.arrayBuffer());
    }

    async getSeekingSegmentFileBuffer(videoId: string, currentTime: number): Promise<{fileSegment: string | null, buffer: ArrayBuffer}> {
        const res = await fetchAdapter.get(this.getBaseAPI(videoId + "/" + currentTime), this.getHeaders());
        if (!res.ok) {
            const json = await res.json();
            throw new ErrorException(res.status, json.message);
        }

        return {fileSegment: res.headers.get("X-Segment-Name"), buffer: (await res.arrayBuffer())};
    }

}


