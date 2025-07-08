export interface IVideo {
    id: string
    title: string
    filePath: string
    DirPath: string
    size: number
    duration: number
}

export interface IFileUpload {
    id: string | undefined
    filePath: string
    dirPath: string
    size: number
}

export interface IFileResWrap <T extends IFileUpload>{
    data: T
    message: string
}