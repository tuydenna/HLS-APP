export interface IUser {
    id: string,
    email: string,
    name: string,
    avatar: string
}

export interface IRegisterDto {
    email: string,
    name: string,
    avatar: string,
    password: string
}