/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Cap parallel page workers — the 2,000-tool dynamic import graph
  // multiplies memory per worker and trips the OOM killer on GitHub
  // Actions runners (7 GB total). Single-threaded builds finish in
  // a few minutes and stay well under the limit.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
