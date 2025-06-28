import BaseService, {fetchAdapter} from "./base-service";
import {IVideoPost} from "@interfaces/video-post";
import {ErrorException} from "@interfaces/error-exeption";

export default class PostService extends BaseService<IVideoPost> {

    constructor() {
        super("/posts");
    }

    async likePost(postId: string, authId: string) {
        const res = await fetchAdapter.put(this.getBaseAPI(postId + "/likes?authId=" + authId), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).data.message);
    }

    async dislikePost(postId: string, authId: string) {
        const res = await fetchAdapter.put(this.getBaseAPI(postId + "/dislikes?authId=" + authId), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).data.message);
    }

}


