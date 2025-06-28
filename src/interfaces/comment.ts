export interface IComment {
    id: string,
    text: string,
    postId: string,
    createdAt: Date,
    updatedAt: Date,
    author: {
       id: string
        name: string
        avatar: string
    }
}