/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Skip in-build TS/ESLint — they run separately in CI/dev and add memory
  // pressure on top of the 2,000-route webpack graph.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // The 2,000-tool dynamic import graph spawns parallel page workers that
  // each blow past the per-worker heap on GitHub Actions runners (7 GB
  // total) and trip the kernel OOM-killer (visible as a bare
  // '<anonymous_script>:1' crash). Force a single sequential worker.
  experimental: {
    cpus: 1,
    workerThreads: false,
    webpackBuildWorker: false,
  },
};

export default nextConfig;
