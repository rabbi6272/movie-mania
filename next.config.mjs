/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL("https://image.tmdb.org/t/p/**"),
      new URL("https://m.media-amazon.com/images/**"),
      new URL("https://img.youtube.com/**"),
    ],
  },
};
export default nextConfig;
