/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly NEXT_PUBLIC_API_URL: string;
        readonly NEXT_PUBLIC_IMAGE_URL: string;
        readonly NEXT_PUBLIC_STORAGE_PROTOCOL: 'http' | 'https';
        readonly NEXT_PUBLIC_STORAGE_HOST: string;
        readonly NEXT_PUBLIC_STORAGE_PORT: string;
    }
}