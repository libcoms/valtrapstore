import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export function getOptimizedUrl(url: string, options?: { width?: number; quality?: number }) {
  if (!url.includes("cloudinary.com")) return url;

  const width = options?.width ?? 800;
  const quality = options?.quality ?? "auto";

  return url.replace(
    "/upload/",
    `/upload/w_${width},q_${quality},f_auto/`
  );
}
