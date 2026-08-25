import BaseService, {fetchAdapter} from "./base-service";
import {IVideoPost} from "@interfaces/video-post";
import {ErrorException} from "@interfaces/error-exeption";
import {RouteProxyConfig} from "@constant/route-proxy-config";

export default class PostService extends BaseService<IVideoPost> {

    constructor() {
        super("/posts");
    }

    async getPosts(): Promise<IVideoPost[]> {
        const res = await fetchAdapter.get(RouteProxyConfig.API_POXY + this.endPoint, this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async getAuthorizedPosts() {
        const res = await fetchAdapter.get(RouteProxyConfig.API_POXY + this.endPoint + "/authors", this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async likePost(postId: string, authId: string):  Promise<IVideoPost> {
        const res = await fetchAdapter.put(this.getBaseAPI(postId + "/likes?authId=" + authId), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async dislikePost(postId: string, authId: string): Promise<IVideoPost> {
        const res = await fetchAdapter.put(this.getBaseAPI(postId + "/dislikes?authId=" + authId), this.getHeaders());
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


