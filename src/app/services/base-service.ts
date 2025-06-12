import {ErrorException} from "@app/types/error-exeption";

const fetchAdapter = {
    get: function (url: string) {
        return fetch(url, {headers: {'Accept': 'application/json'}});
    },
    post: function (url: string, data: any) {
        return fetch(url, {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: JSON.stringify(data)
        })
    }
}

export default class BaseService {
    endPoint!: string;

    constructor(endpoint: string) {
        this.endPoint = endpoint;
    }

    getBaseAPI(endUrl: string  = ""): string {
        return  process.env.NEXT_PUBLIC_DEV_API + this.endPoint + ( endUrl ?  "/" + endUrl : "") ;
    }

    async getOne(id: string) {
        const res = await fetchAdapter.get(this.getBaseAPI(id));
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).data.message);
    }

    async getMany() {
        const res = await fetchAdapter.get(this.getBaseAPI());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).data.message);
    }

    async create(data: any) {
        const res = await fetchAdapter.post(this.getBaseAPI(), data);
        if (res.ok) {
            return (await res.json());
        }
        throw new ErrorException(res.status, (await res.json()).data.message);
    }
}