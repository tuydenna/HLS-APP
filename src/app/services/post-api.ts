const endPoint: string = "/posts"

function getBaseAPI(endUrl: string  = ""): string {
    return  process.env.NEXT_PUBLIC_DEV_API + endPoint + ( endUrl ?  "/" + endUrl : "") ;
}

async function getPosts() {
    return (await fetch(getBaseAPI()).then(res => res.json())).data
}

async function getPost(id: string) {
    return (await fetch(getBaseAPI(id)).then(res => res.json())).data
}

async function updateLikePost(id: string, userId: string) {
    return (
        await fetch(
            getBaseAPI(`${id}/increase-likes?userId=${userId}`),
            {method: "put"}
        ).then(res => res.json())).data
}

async function updateUnlikePost(id: string, userId: string) {
    return (
        await fetch(
            getBaseAPI(`${id}/increase-likes?userId=${userId}`),
            {method: "put"}
        ).then(res => res.json())).data
}

export {getPosts, getPost,updateLikePost, updateUnlikePost}