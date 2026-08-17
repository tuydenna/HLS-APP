import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        localPatterns: [
            {
                pathname: "/api/image-proxy",
            }
        ],
        remotePatterns: [
            {
                protocol: process.env.NEXT_PUBLIC_STORAGE_PROTOCOL,
                hostname: process.env.NEXT_PUBLIC_STORAGE_HOST,
                port: process.env.NEXT_PUBLIC_STORAGE_PORT,
                pathname: process.env.NEXT_PUBLIC_STORAGE_PATH + '/thumbnail/**',
            },
            {
                protocol: process.env.NEXT_PUBLIC_STORAGE_PROTOCOL,
                hostname: process.env.NEXT_PUBLIC_STORAGE_HOST,
                port: process.env.NEXT_PUBLIC_STORAGE_PORT,
                pathname: process.env.NEXT_PUBLIC_STORAGE_PATH + '/avatars/**',
            },
            {
                protocol: 'http',
                hostname: 'aninex.com',
                port: "",
                pathname: '/images/srvc/**',
            },
            {
                protocol: process.env.NEXT_PUBLIC_STORAGE_PROTOCOL,
                hostname: process.env.NEXT_PUBLIC_STORAGE_HOST,
                port: process.env.NEXT_PUBLIC_STORAGE_PORT,
                pathname: '/api/streaming/video/**',
            },
            {
                protocol: 'https',
                hostname: 'img.daisyui.com',
                port: "",
                pathname: '/images/stock/**'
            },
        ],
    },
};

export default nextConfig;
