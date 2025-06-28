import {IFileResWrap, IFileUpload} from "@interfaces/video";

export function uploadFile(video: File, urlPath: string, onProgress?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<IFileResWrap<IFileUpload>> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        if (onProgress) {
            xhr.upload.addEventListener("progress", onProgress)
        }
        xhr.open("POST", `http://localhost:3080/api/files${urlPath}`);
        xhr.setRequestHeader("file-extension",  video.type.split("/")[1]);
        xhr.setRequestHeader("file-size", video.size.toString());
        xhr.setRequestHeader("file-name", video.name);
        xhr.setRequestHeader("content-type", "octet-stream");
        xhr.responseType = "json";
        xhr.send(video)
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
