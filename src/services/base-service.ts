import {ErrorException} from "@interfaces/error-exeption";

export const fetchAdapter = {
    get: function (url: string, headers: HeadersInit) {
        return fetch(url, {
            headers,
            credentials: "include"
        });
    },
    post: function (url: string, headers: HeadersInit, data: any = {}) {
        return fetch(url, {
            headers,
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data)
        })
    },
    put: function (url: string, headers: HeadersInit, data: any = {}) {
        return fetch(url, {
            headers,
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(data)
        })
    }
}

export default class BaseService<T> {
    protected endPoint!: string;
    private headers: HeadersInit = {}
    private defaultHeaders: HeadersInit = {'Content-Type': 'application/json'}

     constructor(endpoint: string) {
        this.endPoint = endpoint;
    }

    getBaseAPI(endUrl: string  = ""): string {
        return  process.env.NEXT_PUBLIC_DEV_API + this.endPoint + ( endUrl ?  "/" + endUrl : "") ;
    }

    async getOne(id: string): Promise<T> {
        const res = await fetchAdapter.get(this.getBaseAPI(id), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async getMany(): Promise<T[]> {
        const res = await fetchAdapter.get(this.getBaseAPI(), this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async create(data: any, path: string = ""): Promise<T> {
        const res = await fetchAdapter.post(this.getBaseAPI(path), this.getHeaders(), data);
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async update(id: string, data: any = {}): Promise<T> {
        const res = await fetchAdapter.put(this.getBaseAPI(id),this.getHeaders(), data);
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    setHeaders(headers: HeadersInit) {
        this.headers = headers;
        return this;
    }

    protected getHeaders(): HeadersInit {
        return {...this.defaultHeaders, ...this.headers};
    }
}