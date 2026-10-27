import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { supabase } from "./supabaseClient.js";
const getStorageBucket = () => {
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET;
    if (!bucketName) {
        throw new Error("SUPABASE_STORAGE_BUCKET environment variable is missing.");
    }
    return supabase.storage.from(bucketName);
};
export const uploadWebpImage = async (fileBuffer, folder, resizeOptions, quality = 80) => {
    const optimizedBuffer = await sharp(fileBuffer)
        .resize(resizeOptions)
        .webp({ quality })
        .toBuffer();
    const path = `${folder}/${randomUUID()}.webp`;
    const bucket = getStorageBucket();
    const { error } = await bucket.upload(path, optimizedBuffer, {
        cacheControl: "31536000",
        contentType: "image/webp",
        upsert: false,
    });
    if (error) {
        throw new Error(`Supabase image upload failed: ${error.message}`);
    }
    const { data } = bucket.getPublicUrl(path);
    if (!data.publicUrl) {
        throw new Error("Supabase did not return a public URL for the uploaded image.");
    }
    return { url: data.publicUrl, path, bufferLength: optimizedBuffer.length };
};
export const deleteStoredImage = async (pathOrUrl) => {
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET;
    if (!bucketName) {
        throw new Error("SUPABASE_STORAGE_BUCKET environment variable is missing.");
    }
    let path = pathOrUrl;
    if (pathOrUrl.startsWith("http")) {
        const imageUrl = new URL(pathOrUrl);
        const supabaseUrl = process.env.SUPABASE_URL;
        if (!supabaseUrl) {
            throw new Error("SUPABASE_URL environment variable is missing.");
        }
        if (imageUrl.origin !== new URL(supabaseUrl).origin) {
            return false;
        }
        const objectPrefix = `/storage/v1/object/public/${bucketName}/`;
        const decodedPath = decodeURIComponent(imageUrl.pathname);
        if (!decodedPath.startsWith(objectPrefix)) {
            return false;
        }
        path = decodedPath.slice(objectPrefix.length);
    }
    if (!path) {
        return false;
    }
    const { error } = await supabase.storage.from(bucketName).remove([path]);
    if (error) {
        throw new Error(`Supabase image deletion failed: ${error.message}`);
    }
    return true;
};
