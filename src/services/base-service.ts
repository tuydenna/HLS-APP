import {ErrorException} from "@interfaces/error-exeption";

export const fetchAdapter = {
    get: function (url: string, headers: HeadersInit, signal?: AbortSignal) {
        return fetch(url, {
            headers,
            signal,
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
    },
    delete: function (url: string, headers: HeadersInit) {
        return fetch(url, {
            headers,
            method: "DELETE",
            credentials: "include"
        })
    }
}

export default class BaseService<T> {
    protected readonly endPoint!: string;
    private readonly baseAPIURL: string;
    private headers: HeadersInit = {}
    private lastEndpoint: string = "";
    private defaultHeaders: HeadersInit = {'Content-Type': 'application/json'};

     constructor(endpoint: string, baseAPIURL: string = process.env.NEXT_PUBLIC_API_URL) {
        this.endPoint = endpoint;
        this.baseAPIURL = baseAPIURL;
    }

    getBaseAPI(endUrl: string  = ""): string {
        if (endUrl.trim()) {
            endUrl = endUrl.startsWith("/") ? endUrl : "/" + endUrl;
            return this.baseAPIURL + this.endPoint + endUrl + this.lastEndpoint
        }
        return this.baseAPIURL + this.endPoint + this.lastEndpoint ;
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
        console.log(this.getBaseAPI(id));
        const res = await fetchAdapter.put(this.getBaseAPI(id),this.getHeaders(), data);
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    async delete(id: string): Promise<T> {
        const res = await fetchAdapter.delete(this.getBaseAPI(id),this.getHeaders());
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    setHeaders(headers: HeadersInit) {
        this.headers = headers;
        return this;
    }

    setLastEndpoint(endpoint: string) {
       if (endpoint.trim()) {
           this.lastEndpoint = endpoint.startsWith("/") ? endpoint : "/" + endpoint;
       }
    }

    protected getHeaders(): HeadersInit {
        return {...this.defaultHeaders, ...this.headers};
    }
}