import type { NextConfig, SizeLimit } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: process.env.BODY_SIZE_LIMIT ? process.env.BODY_SIZE_LIMIT as SizeLimit : "10mb",
        }
    }
};

export default nextConfig;
