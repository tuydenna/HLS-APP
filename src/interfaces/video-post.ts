import {ILikePost} from "./likePosts";
import {IVideo} from "./video";
import {IUser} from "./user";
import {IComment} from "./comment";

export interface IVideoPost {
    id: string
    videoId: string
    authorId: string
    slug: string
    title: string
    likes: number
    views: number
    description: number
    thumbnail: string
    status: PostStatus
    createdAt: Date
    updatedAt: Date
    likePosts: ILikePost[]
    video: IVideo
    author: IUser
    comments: IComment[]
}

export enum PostStatus {
    Published = "PUBLISHED",
    Pending = "PENDING",
    Error = "ERROR"
}