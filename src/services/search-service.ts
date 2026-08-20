import BaseService, {fetchAdapter} from "./base-service";
import {IVideoPost} from "@interfaces/video-post";
import {ErrorException} from "@interfaces/error-exeption";

export default class SearchService extends BaseService<IVideoPost> {

    constructor() {
        super("/searches");
    }

    async searchAutocompletes(searchKey: string):  Promise<string[]> {
        this.setLastEndpoint(searchKey + "/autoCompletes");
        const res = await fetchAdapter.get(this.getBaseAPI(), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).data.message);
    }

    async searchPosts(searchKey: string = "", take: number = 15, skip: number = 0): Promise<IVideoPost[]> {
        try {
            const URLParams = new URLSearchParams();
            URLParams.set("searchKey", searchKey);
            URLParams.set("skip", skip.toString());
            URLParams.set("take", take.toString());
            this.setLastEndpoint("/posts?" + URLParams.toString());
            const res = await fetchAdapter.get(this.getBaseAPI(), this.getHeaders());

            if (res.ok) {
                return (await res.json()).data;
            }

            throw new ErrorException(res.status, res.statusText || (await res.json()).data.message);
        } catch (e) {
            throw e;
        }
        finally {
            console.log("searchPosts Finally")
        }
    }

}


