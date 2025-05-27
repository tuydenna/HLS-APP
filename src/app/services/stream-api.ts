
const endPoint: string = "/streaming/videos"

function getBaseAPI(endUrl: string  = ""): string {
    return  process.env.NEXT_PUBLIC_DEV_API + endPoint + ( endUrl ?  "/" + endUrl : "") ;
}

async function getSegmentBuffer(video_path: string, range: string) {
    return (
        await fetch(
            getBaseAPI(video_path),
            { headers: { Range: range } }
    ).then(res => res.arrayBuffer()))
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

export {getSegmentBuffer}