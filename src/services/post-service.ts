import BaseService, {fetchAdapter} from "./base-service";
import {IVideoPost} from "@interfaces/video-post";
import {ErrorException} from "@interfaces/error-exeption";

export default class PostService extends BaseService<IVideoPost> {
    constructor() {
        super("/posts");
    }

    async getPosts(): Promise<IVideoPost[]> {
        const res = await fetchAdapter.get(this.getBaseAPIProxy(), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async getAuthorizedPosts() {
        this.setLastEndpoint("/authors");
        const res = await fetchAdapter.get(this.getBaseAPIProxy(), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async likePost(postId: string, authId: string):  Promise<IVideoPost> {
        this.setLastEndpoint(postId + "/likes?authId=" + authId);
        const res = await fetchAdapter.put(this.getBaseAPIProxy(), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async dislikePost(postId: string, authId: string): Promise<IVideoPost> {
        this.setLastEndpoint(postId + "/dislikes?authId=" + authId);
        const res = await fetchAdapter.put(this.getBaseAPIProxy(), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async increaseView(postId: string): Promise<IVideoPost> {
        const res = await fetchAdapter.put(this.getBaseAPI(postId + "/views"), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

}


