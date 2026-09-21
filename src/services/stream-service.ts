import BaseService, {fetchAdapter} from "@services/base-service";
import {ErrorException} from "@interfaces/error-exeption";

export default class StreamService extends BaseService<null> {

    private abortController!: AbortController;

    constructor() {
        super("/v2/streams/fmp4", "/api/backend-proxy");
    }

    async getSegmentFileBuffer(videoId: string, segmentFile: string): Promise<ArrayBuffer | null> {
        this.abortController = new AbortController();
        const res = await fetchAdapter.get(this.getBaseAPI(videoId + "/" + segmentFile), this.getHeaders(), this.abortController.signal);
        if (!res.ok) {
            const json = await res.json();
            throw new ErrorException(res.status, json.message);
        }
        return (res.status === 204) ? null : (await res.arrayBuffer());
    }

    async getSeekingSegmentFileBuffer(videoId: string, currentTime: number, scale: string): Promise<{fileSegment: string | null, buffer: ArrayBuffer}> {
        this.abortController = new AbortController();
        const res = await fetchAdapter.get(this.getBaseAPI("seeks/" + videoId + "/" + currentTime + "?scale=" + scale), this.getHeaders(), this.abortController.signal);
        if (!res.ok) {
            const json = await res.json();
            throw new ErrorException(res.status, json.message);
        }

        return {fileSegment: res.headers.get("X-Segment-Name"), buffer: (await res.arrayBuffer())};
    }

    getPlaylistEndPoint(videoId: string, scale?: string): string {
        return process.env.NEXT_PUBLIC_API_URL + this.getEndPoint() + "/" + videoId + "/playlist";
        return this.getBaseAPI(videoId + "/playlist?scale=" + scale);
    }

    abortOngoingStream() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

}


