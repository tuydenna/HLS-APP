export interface IVideo {
    id: string
    title: string
    path: string
    size: number
}

export interface IFileUpload {
    id: string | undefined
    dir_path: string
    size: number
}

export interface IFileResWrap <T extends IFileUpload>{
    data: T
    message: string
}