import {ILikePost} from "@app/types/likePosts";
import {IVideo} from "@app/types/video";
import {IUser} from "@app/types/user";
import {IComment} from "@app/types/comment";

export interface IVideoPost {
    id: string,
    videoId: string,
    authorId: string,
    slug: string,
    title: string,
    likes: number,
    views: number,
    description: number
    thumbnail: string
    likePosts: ILikePost[],
    video: IVideo,
    author: IUser,
    comments: IComment[]
}