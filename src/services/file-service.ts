import BaseService from "./base-service";
import {IFileResWrap, IFileUpload} from "@interfaces/video";
export default class FileService extends BaseService<IFileUpload> {
    private xhrRequests: XMLHttpRequest[] = [];

    constructor() {
        super("/files");
    }

    uploadAvatar(file: File, onProgress?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<IFileResWrap<IFileUpload>> {
        this.setLastEndpoint("/avatars");
        return this.xhrUpload(file, onProgress);
    }

    uploadThumbnail(file: File, onProgress?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<IFileResWrap<IFileUpload>> {
        this.setLastEndpoint("/thumbnails");
        return this.xhrUpload(file, onProgress);
    }

    uploadVideo(file: File, onProgress?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<IFileResWrap<IFileUpload>> {
        this.setLastEndpoint("/videos");
        return this.xhrUpload(file, onProgress);
    }

    abortUpload() {
        console.log("[abortUpload]", this.xhrRequests);
        for (const xhrRequest of this.xhrRequests) {
            if (xhrRequest.readyState !== xhrRequest.DONE) {
                xhrRequest.abort();
            }
        }
        this.xhrRequests = [];
    }

    private xhrUpload(file: File, onProgress?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<IFileResWrap<IFileUpload>> {
        console.log("xhrUpload", this.getBaseAPIProxy());
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            this.xhrRequests.push(xhr);
            if (onProgress) {
                xhr.upload.addEventListener("progress", onProgress)
            }
            xhr.open("POST", this.getBaseAPIProxy());
            xhr.withCredentials = true;
            xhr.setRequestHeader("file-extension",  file.type.split("/")[1]);
            xhr.setRequestHeader("file-size", file.size.toString());
            xhr.setRequestHeader("file-name", encodeURIComponent(file.name));
            xhr.setRequestHeader("content-type", "octet-stream");
            xhr.responseType = "json";
            xhr.send(file)
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                }
                reject(xhr.response);
            }
            xhr.onerror = function () {
                reject(xhr.response);
            }
        })
    }

}
