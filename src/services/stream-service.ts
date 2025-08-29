import BaseService, {fetchAdapter} from "@services/base-service";
import {ErrorException} from "@interfaces/error-exeption";

export default class StreamService extends BaseService<null> {

    private abortController!: AbortController;

    constructor() {
        super("/streams/fmp4");
    }

    async getSegmentFileBuffer(videoId: string, segmentFile: string): Promise<ArrayBuffer> {
        this.abortController = new AbortController();
        const res = await fetchAdapter.get(this.getBaseAPI(videoId + "/" + segmentFile), this.getHeaders(), this.abortController.signal);
        if (!res.ok) {
            const json = await res.json();
            throw new ErrorException(res.status, json.message);
        }
        return (await res.arrayBuffer());
    }

    async getSeekingSegmentFileBuffer(videoId: string, currentTime: number, scale: string): Promise<{fileSegment: string | null, buffer: ArrayBuffer}> {
        const res = await fetchAdapter.get(this.getBaseAPI("seeks/" + videoId + "/" + currentTime + "?scale=" + scale), this.getHeaders());
        if (!res.ok) {
            const json = await res.json();
            throw new ErrorException(res.status, json.message);
        }

        return {fileSegment: res.headers.get("X-Segment-Name"), buffer: (await res.arrayBuffer())};
    }

    getPlaylistEngPoint(videoId: string): string {
        return this.getBaseAPI(videoId + "/playlist");
    }

    abortOngoingStream() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

}


