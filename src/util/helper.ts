export function getEnv(key: string) {
    if(process.env[key]) {
        return process.env[key]
    }
    console.warn(`${process.env[key]} env key: ${key}`)
    throw Error(`unknown env key: ${key}`);
}

export function getImageURL(path: string | undefined): string{
    return path ? process.env.NEXT_PUBLIC_IMAGE_URL + path : "";
}

export function timeAgo(date: Date): string {
    const seconds = Math.floor((+new Date() - +new Date(date)) / 1000);
    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
    ];
    for (let i = 0; i < intervals.length; i++) {
        const interval = Math.floor(seconds / intervals[i].seconds);
        if (interval >= 1) {
            return `${interval} ${intervals[i].label}${interval !== 1 ? "s" : ""} ago`;
        }
    }
    return "just now";
}

export function isInFullScreenMode() {
    return document.fullscreenElement !== null
}

export function getAvatarFallbackName(name: string) {
    return name.charAt(0).toUpperCase();
}