import {Input} from "@app/components/ui/input";
import React, {JSX, useState} from "react";
import {Card, CardContent} from "@app/components/ui/card";
import {getImageProxyAPI, getImageURL, timeAgo} from "@util/helper";
import {IVideoPost, PostStatus} from "@interfaces/video-post";
import PostService from "@services/post-service";
import {ErrorIcon, HomeIcon, PendingIcon, SuccessIcon} from "@app/components/icon";
import {onDidMount, onDidUpdate} from "@app/lib/react-adapter";
import {getAuth} from "@lib/utils";
import {IUser} from "@interfaces/user";
import Link from "next/link";
import {AvatarUI} from "@components/ui/avatar";
import Image from "next/image";

export function RightSideLayout({newPost}: {newPost: IVideoPost | undefined}) {

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [posts, setPosts] = useState<IVideoPost[]>([]);
    const [author, setAuthor]  = useState<IUser | null>(null);
    let holdTimeout: NodeJS.Timeout | null = null;
    let isHolding: boolean = false;
    const holdDuration = 1000; // 1 sec
    const postService = new PostService();

    onDidMount(() => {
        new PostService().getAuthorizedPosts().then(data=>{
            setPosts(data);
        })
        setAuthor(getAuth());
    })

    onDidUpdate(() => {
        if (newPost) {
            setPosts([...posts, newPost]);
        }
    }, [newPost]);

    const onmousedownLongPress = function (e: any, post: IVideoPost) {
        e.preventDefault();
        isHolding = true;
        holdTimeout = setTimeout(async () => {
            if (isHolding) {
                // if (post.status === PostStatus.Pending) {
                //     alert("Wait pending post is being process...");
                //     return;
                // }
                const yes: boolean =  confirm("Are you sure you want to delete this post?");
                if (yes) {
                    await deletePost(post.id);
                }
                isHolding = false;
                clearTimeout(holdTimeout!)
            }
        }, holdDuration);
    }

    const onmouseupLongPress = function (e: any) {
        e.preventDefault();
        if (holdTimeout) {
            clearTimeout(holdTimeout);
            isHolding = false;
        }
    }

    const filteredPosts: IVideoPost[] = posts
        ?.filter((post) => post.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "latest") {
                return +new Date(b.createdAt) - +new Date(a.createdAt);
            } else if (sortBy === "popular") {
                return b.views - a.views;
            }
            return 0;
        });

    async function deletePost(id: string) {
        try {
            await postService.delete(id);
            setPosts(posts.filter(post => post.id !== id));
        } catch (e) {
            console.log(e);
        }
    }

    function renderPostStatus(status: PostStatus): JSX.Element {
        switch (status) {
            case PostStatus.Pending:
                return <PendingIcon/>
            case PostStatus.Published:
                return <SuccessIcon/>
            default:
                return <ErrorIcon/>
        }
    }

    return (
        <div className="flex flex-col w-full md:w-1/3 bg-white shadow-lg rounded-2xl p-3 md:p-6 min-h-[50dvh] max-h-[95dvh] md:max-h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Your Posts</h3>
                <div className="flex items-center gap-2">
                    <AvatarUI src={getImageURL(author?.avatar)} fallbackName={author?.name} widthClass="w-10" heightClass="h-10"/>
                    {/*<span className="text-sm font-medium">{author?.name}</span>*/}
                    <Link href="/"><HomeIcon className="cursor-pointer text-gray-400" /></Link>
                </div>
            </div>
            <div className="flex gap-2 mb-4">
                <Input
                    placeholder="Search posts..."
                    className="flex-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Viewed</option>
                </select>
            </div>
            <div className="flex flex-col space-y-3 grow overflow-y-scroll custom-scrollbar clear-default-safari-long-press">
                    {filteredPosts.map((post, index) => (
                        <Card key={index} className="cursor-pointer py-1" onMouseDown={(event) => onmousedownLongPress(event, post)} onTouchStart={(event) => onmousedownLongPress(event, post)} onTouchEnd={onmouseupLongPress} onMouseUp={onmouseupLongPress}>
                            <CardContent className="p-4">
                                {post.thumbnail && (
                                    <div className="w-full aspect-video mb-3 overflow-hidden rounded">
                                        <Image
                                            src={getImageProxyAPI(getImageURL(post.thumbnail))}
                                            alt="thumbnail"
                                            width={200}
                                            height={200}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold line-clamp-1">{post.title}</h4>
                                    <span className="text-xs text-gray-500">{renderPostStatus(post.status)}</span>
                                </div>
                                <p className="text-sm  text-wraptext-gray-500 line-clamp-2">{post.description}</p>
                                <div className="mt-2 text-xs text-gray-400 flex justify-between">
                                    <span>{timeAgo(post.createdAt)}</span>
                                    <span>{post.views} views</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    )
}