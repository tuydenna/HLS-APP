import {Input} from "@app/components/ui/input";
import {Textarea} from "@app/components/ui/textarea";
import {Select, SelectContent, SelectItem} from "@app/components/ui/select";
import {Button} from "@app/components/ui/button";
import {LoaderSpinner} from "@app/components/ui/loader-spinner";
import React, {FormEvent, useState} from "react";
import {IVideoPost} from "@interfaces/video-post";
import PostService from "@services/postv2-api";
import {uploadFile} from "@util/file";
import {getAuth} from "@lib/utils";

export function LeftSideLayout({setCreatedPost}: {setCreatedPost: Function}) {

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [status, setStatus] = useState("Draft");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [isSummiting, setIsSummiting] = useState(false);
    const [videoUploadPercentage, setVideoUploadPercentage] = useState(0);
    const [posts, setPosts] = useState<IVideoPost[]>([]);

    function onCancelPublish() {
        setIsSummiting(false);
    }

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement | null>) => {
        setThumbnail(e.target.files![0]);
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement | null>) => {
        setVideo(e.target.files![0]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: string) => {
        e!.preventDefault();
        const file: File = e.dataTransfer!.files[0];
        type === "image" ? setThumbnail(file) : setVideo(file);
    };

    function onResetForm() {
        setTitle("");
        setDesc("");
        setThumbnail(null);
        setVideo(null);
        setIsSummiting(false)
    }

    const onPublish = async (e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        setIsSummiting(true);
        try {
            const videoRes = await uploadFile(video!, "/video", (e) => {
                setVideoUploadPercentage((Math.floor(e.loaded / e.total * 100)));
            })
            const thumbnailRes = await uploadFile(thumbnail!, "/thumbnail")

            const data = {
                title,
                description: desc,
                authorId: getAuth().id,
                videoId: videoRes.data.id,
                thumbnail: thumbnailRes.data.filePath
            };
            const post: IVideoPost = await new PostService().create(data);
            setPosts([post, ...posts])
            setCreatedPost(post);
            setTimeout(onResetForm, 3000)
        } catch (e) {
            console.warn(e)
            alert("Failed to create post, try again later");
            setIsSummiting(false);
        }

    };

    return (
        <div className="w-2/3 bg-white shadow-xl rounded-2xl p-6 space-y-4 relative">
            <h2 className="text-2xl font-bold">Create New Post</h2>
            <form onSubmit={onPublish} className="space-y-4">
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required={true} />
                <Textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)}  required={true} />
                <Select value={status} onValueChange={setStatus}>
                    <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex">
                    <div
                        onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, "image")}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-2 border-dashed p-4 rounded-xl text-center cursor-pointer mr-5 w-[40%]"
                    >
                        <p>Drop thumbnail here or click to upload</p>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="hidden"
                            id="thumbnail-upload"
                        />
                        <label htmlFor="thumbnail-upload" className="inline-block px-4 py-2 mt-2 bg-blue-100 rounded cursor-pointer text-sm text-blue-600">
                            Select Image
                        </label>
                        {thumbnail && (
                            <div className="w-full aspect-video  mt-2 overflow-hidden rounded">
                                <img
                                    src={URL.createObjectURL(thumbnail)}
                                    alt="thumb"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        )}
                    </div>
                    <div
                        onDrop={(e) => handleDrop(e, "video")}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-2 border-dashed p-4 rounded-xl text-center cursor-pointer  w-[60%]"
                    >
                        <p>Drop video here or click to upload</p>
                        <Input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="hidden"
                            id="video-upload"
                        />
                        <label htmlFor="video-upload" className="inline-block px-4 py-2 mt-2 bg-blue-100 rounded cursor-pointer text-sm text-blue-600">
                            Select Video
                        </label>
                        {video && (
                            <video controls className="w-full mt-2 rounded">
                                <source src={URL.createObjectURL(video)} />
                            </video>
                        )}
                    </div>
                </div>
                <Button type="submit" className="cursor-pointer">Publish</Button>
            </form>
            {isSummiting && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
                    <LoaderSpinner className="h-12 w-12 text-indigo-600"/>
                    <p className="mt-4 text-lg font-semibold text-gray-700">Publishing your post ... {videoUploadPercentage}%</p>
                    <Button className="mt-5" onClick={onCancelPublish}>Cancel</Button>
                </div>
            )}
        </div>
    )
}