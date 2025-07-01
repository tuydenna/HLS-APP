import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: "3080",
                pathname: '/thumbnail/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: "3080",
                pathname: '/avatars/**',
            },
            {
                protocol: 'http',
                hostname: 'aninex.com',
                port: "",
                pathname: '/images/srvc/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: "3080",
                pathname: '/api/streaming/video/**',
            },{
                protocol: 'https',
                hostname: 'img.daisyui.com',
                port: "",
                pathname: '/images/stock/**'
            },
        ],
    },
};

export default nextConfig;
