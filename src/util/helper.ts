export function getEnv(key: string) {
    console.log("in fun", process.env[key]);
    if(process.env[key]) {
        return process.env[key]
    }
    console.warn(`${process.env[key]} env key: ${key}`)
    throw Error(`unknown env key: ${key}`);
}

export function getImageURL(path: string): string {
    return process.env.NEXT_PUBLIC_DEV_IMAGE + path;
}