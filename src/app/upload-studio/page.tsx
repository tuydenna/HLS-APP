"use client"

import {Button} from "@app/components/ui/button";
import { Input } from "@app/components/ui/input"
import {Textarea} from "@app/components/ui/textarea";
import {Progress} from "@app/components/ui/progress";
import React, {FormEvent, RefObject, useRef, useState} from "react";
import FileService from "@app/services/upload-api";
import PostService from "@app/services/postv2-api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@app/components/ui/alert-dialog"

function uploadFile(video: File, urlPath: string, onProgress?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<any> {
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

export default function CreatePostStudio() {
    const titleRef: RefObject<HTMLInputElement | null> = useRef(null);
    const descriptionRef: RefObject<HTMLTextAreaElement | null> = useRef(null);
    const videoFileRef: RefObject<HTMLInputElement | null> = useRef(null);
    const thumbnailRef: RefObject<File | null> = useRef(null);

    const [videoUploadPercentage, setVideoUploadPercentage] = useState(0);
    const [thumbnailSrc, setThumbnailSrc] = useState<string | undefined>(undefined);
    const [isSummiting, setIsSummiting] = useState<boolean>(false);
    const [isAlert, setIsAlert] = useState<boolean>(false);

    async function onSave(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSummiting(true);

        const video: File = videoFileRef.current!.files![0];
        const thumbnail: File = thumbnailRef.current!;
        try {
            const videoRes = await uploadFile(video, "/video", (e) => {
                setVideoUploadPercentage((Math.floor(e.loaded / e.total * 100)));
            })
            const thumbnailRes = await uploadFile(thumbnail, "/thumbnail")

            console.log(thumbnailRes, videoRes);
            const data = {
                title: titleRef.current!.value,
                description: descriptionRef.current!.value,
                authorId: "684a96e5078b2db4f72a75b0",
                videoId: videoRes.data.id,
                thumbnail: thumbnailRes.data.dir_path
            };
            console.warn(data);
            await new PostService().create(data);
            setIsAlert(true)
            setTimeout(() => setIsAlert(false), 3000);
        } catch (e) {
            console.warn(e)
            alert("Failed to create post, try again later");
            setIsSummiting(false);
        }
    }

    function onChangeThumbnail(e: React.ChangeEvent<HTMLInputElement | null>) {
        const file: File = e.target.files![0]
        thumbnailRef.current = file
        setThumbnailSrc(URL.createObjectURL(file));
    }

    return (
        <div className="flex justify-center items-center  w-full h-[100vh]">
            <div className="flex flex-col w-[500px]">
                <form action="#" onSubmit={onSave}>
                    <h1 className="text-center text-3xl mb-5">Update Studio</h1>
                    <Input placeholder="Title" ref={titleRef} className="mb-5" required={true}/>
                    <Textarea placeholder="Description" ref={descriptionRef} className="mb-5" required={true} />
                    <div className="mb-5">
                        <label htmlFor="picture">Thumbnail</label>
                        <Input type="file"  placeholder="thumbnail"  className="mb-5" accept="image/*" onChange={onChangeThumbnail}/>
                        <img src={thumbnailSrc} width={100} height={100} alt="thumbnail" style={{display: thumbnailSrc ? "block" : "none"}} className="border border-gray-300"/>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="picture">File Video</label>
                        <Input type="file" ref={videoFileRef} placeholder="video" className="mb-3" accept="video/*" />
                        <div className="flex justify-space-between" style={{display: videoUploadPercentage ? 'block' : 'none'}}>
                            <Progress value={videoUploadPercentage} />
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Button className="cursor-pointer" type="submit" disabled={isSummiting}>Save</Button>
                        <Button className="bg-gray-600 cursor-pointer " type="reset">Cancel</Button>
                    </div>
                </form>
                <AlertDialog open={isAlert}>
                    <AlertDialogContent style={{width: 200}}>
                        <AlertDialogHeader>
                            {/*<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>*/}
                            <AlertDialogDescription className="text-center text-green-300 text-lg">
                                Save successfully
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            {/*<AlertDialogCancel>Cancel</AlertDialogCancel>*/}
                            {/*<AlertDialogAction>Continue</AlertDialogAction>*/}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}