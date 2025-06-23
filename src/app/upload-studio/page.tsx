/*
"use client"

import {Button} from "@appapp/components/ui/button";
import { Input } from "@appapp/components/ui/input"
import {Textarea} from "@appapp/components/ui/textarea";
import {Progress} from "@appapp/components/ui/progress";
import React, {FormEvent, RefObject, useRef, useState} from "react";
import FileService from "@appapp/services/upload-api";
import PostService from "@appapp/services/postv2-api";
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
} from "@appapp/components/ui/alert-dialog"

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
    const thumbnailRef: RefObject<HTMLInputElement | null> = useRef(null);

    const [videoUploadPercentage, setVideoUploadPercentage] = useState(0);
    const [thumbnailSrc, setThumbnailSrc] = useState<string | undefined>(undefined);
    const [isSummiting, setIsSummiting] = useState<boolean>(false);
    const [isAlert, setIsAlert] = useState<boolean>(false);

    async function onSave(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSummiting(true);

        const video: File = videoFileRef.current!.files![0];
        const thumbnail: File = thumbnailRef.current!.files![0];
        try {
            const videoRes = await uploadFile(video, "/video", (e) => {
                setVideoUploadPercentage((Math.floor(e.loaded / e.total * 100)));
            })
            const thumbnailRes = await uploadFile(thumbnail, "/thumbnail")

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

    function onResetForm() {
        titleRef.current!.value = "";
        descriptionRef.current!.value = "";
        thumbnailRef.current!.value = "";
        videoFileRef.current!.value = "";
        setIsSummiting(false);
        setIsAlert(false);
        setThumbnailSrc("");
    }

    function onChangeThumbnail(e: React.ChangeEvent<HTMLInputElement | null>) {
        const file: File = e.target.files![0]
        thumbnailRef.current = e.target
        setThumbnailSrc(URL.createObjectURL(file));
    }
    return (
        <div className="flex p-6 gap-6">
            <div className="w-2/3 bg-white shadow-xl rounded-2xl p-6 space-y-4">
                <h2 className="text-2xl font-bold">Create New Post</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block font-medium">Title</label>
                        <input type="text" placeholder="Enter title" className="w-full p-2 border rounded-xl"/>
                    </div>

                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea placeholder="Enter description" className="w-full p-2 border rounded-xl"
                                  rows="4"></textarea>
                    </div>

                    <div>
                        <label className="block font-medium">Thumbnail Image</label>
                        <input type="file" accept="image/!*" className="w-full p-2 border rounded-xl"/>
                    </div>

                    <div>
                        <label className="block font-medium">Upload Video</label>
                        <input type="file" accept="video/!*" className="w-full p-2 border rounded-xl"/>
                    </div>

                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
                        Post
                    </button>
                </form>
            </div>

            <div className="w-1/3 bg-gray-50 shadow-lg rounded-2xl p-4 overflow-y-auto max-h-[80vh]">
                <h3 className="text-xl font-semibold mb-4">Your Posts</h3>
                <ul className="space-y-3">
                    <li className="bg-white p-3 rounded-xl shadow-sm">
                        <strong>Sample Post Title</strong>
                        <p className="text-sm text-gray-500">Short description here...</p>
                    </li>
                </ul>
            </div>
        </div>

    )

    return (
        <div className="flex justify-center items-center  w-full h-[100vh]">
            <div className="flex flex-col w-[500px]">
                <form action="#" onSubmit={onSave}>
                    <h1 className="text-center text-3xl mb-5">Update Studio</h1>
                    <Input placeholder="Title" ref={titleRef} className="mb-5" required={true}/>
                    <Textarea placeholder="Description" ref={descriptionRef} className="mb-5" required={true}/>
                    <div className="mb-5">
                        <label htmlFor="picture">Thumbnail</label>
                        <Input type="file" placeholder="thumbnail" className="mb-5" accept="image/!*"
                               onChange={onChangeThumbnail}/>
                        <img src={thumbnailSrc} width={100} height={100} alt="thumbnail"
                             style={{display: thumbnailSrc ? "block" : "none"}} className="border border-gray-300"/>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="picture">File Video</label>
                        <Input type="file" ref={videoFileRef} placeholder="video" className="mb-3" accept="video/!*"/>
                        <div className="flex justify-space-between"
                             style={{display: videoUploadPercentage ? 'block' : 'none'}}>
                            <Progress value={videoUploadPercentage}/>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Button className="cursor-pointer" type="submit" disabled={isSummiting}>Save</Button>
                        <Button className="bg-gray-600 cursor-pointer " onClick={onResetForm}>Cancel</Button>
                    </div>
                </form>
                <AlertDialog open={isAlert} onOpenChange={()=> {onResetForm()}} >
                    <AlertDialogContent style={{width: 200}}>
                        <AlertDialogHeader>
                            <AlertDialogDescription className="text-center text-green-300 text-lg">
                                Save successfully
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel  className="text-red-600">Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}*/

"use client"

import React from "react";
import {LeftSideLayout} from "@app/upload-studio/components/left-side-layout";
import {RightSideLayout} from "@app/upload-studio/components/right-side-layout";
import {IVideoPost} from "@interfaces/video-post";

export default function CreatePostDashboard() {

    const [createPost, setCreatePost] = React.useState<IVideoPost>();

    return (
        <div className="flex p-6 gap-6">
            <LeftSideLayout setCreatedPost={(post: IVideoPost)=> setCreatePost(post)} />
            <RightSideLayout newPost={createPost} />
        </div>
    );
}

