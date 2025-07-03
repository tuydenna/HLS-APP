import {Input} from "@app/components/ui/input";
import React, {JSX, useState} from "react";
import {Card, CardContent} from "@app/components/ui/card";
import {getImageURL, timeAgo} from "@util/helper";
import {IVideoPost, PostStatus} from "@interfaces/video-post";
import PostService from "@services/postv2-api";
import {ErrorIcon, HomeIcon, PendingIcon, SuccessIcon} from "@app/components/icon";
import {onDidMount, onDidUpdate} from "@app/lib/react-adapter";
import {getAuth} from "@lib/utils";
import {IUser} from "@interfaces/user";
import Link from "next/link";
import {AvatarUI} from "@components/ui/avatar";

export function RightSideLayout({newPost}: {newPost: IVideoPost | undefined}) {

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [posts, setPosts] = useState<IVideoPost[]>([]);
    const [author, setAuthor]  = useState<IUser | null>(null);

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

    onDidMount(() => {
        new PostService().getMany().then(data=>{
            setPosts(data);
        })
        setAuthor(getAuth());
    })

    onDidUpdate(() => {
        if (newPost) {
            setPosts([...posts, newPost]);
        }
    }, [newPost]);

    const filteredPosts: IVideoPost[] = posts
        .filter((post) => post.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "latest") {
                return +new Date(b.createdAt) - +new Date(a.createdAt);
            } else if (sortBy === "popular") {
                return b.views - a.views;
            }
            return 0;
        });

    return (
        <div className="w-1/3 bg-gray-50 shadow-lg rounded-2xl p-4 overflow-y-auto max-h-[95vh]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Your Posts</h3>
                <div className="flex items-center gap-2">
                    <AvatarUI src={getImageURL(author?.avatar)} fallbackName={author?.name} widthClass="w-10" heightClass="h-10"/>
                    <span className="text-sm font-medium">{author?.name}</span>
                    <Link href="/"><HomeIcon className="cursor-pointer text-gray-400" /></Link>
                </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
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
            <ul className="space-y-3">
                {filteredPosts.map((post, index) => (
                    <Card key={index} className="cursor-pointer py-1">
                        <CardContent className="p-4">
                            {post.thumbnail && (
                                <div className="w-full aspect-video mb-3 overflow-hidden rounded">
                                    <img
                                        src={getImageURL(post.thumbnail)}
                                        alt="thumbnail"
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
            </ul>
        </div>
    )
}