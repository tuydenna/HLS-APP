export interface IUser {
    id: string,
    email: string,
    name: string,
    avatar: string
    address: {
        street: string,
        city: string,
        state: string,
        zip: string
    },
}