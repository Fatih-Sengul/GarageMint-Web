import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "http", hostname: "localhost", port: "8080", pathname: "/uploads/**" },
            { protocol: "https", hostname: "picsum.photos" },
            { protocol: "https", hostname: "example.com" },
        ],
    },
};

export default nextConfig;
