import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/Terminal/Aws/AwsS3ClientConfig.js";
/**
 * Optimizes an image buffer using Sharp and uploads it to AWS S3.
 */
export const uploadAndOptimizeImage = async (fileBuffer, folder = "tasks") => {
    const optimizedBuffer = await sharp(fileBuffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    const uploadedFileName = `${folder}/${Date.now()}-optimized.webp`;
    await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uploadedFileName,
        Body: optimizedBuffer,
        ContentType: "image/webp"
    }));
    const newUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadedFileName}`;
    return { newUrl, uploadedFileName };
};
/**
 * Deletes an object from AWS S3 using either its full URL or a direct file path/key.
 */
export const deleteImageFromS3 = async (imageUrlOrKey) => {
    try {
        let filePath = imageUrlOrKey;
        // If it's a full URL, parse out the pathname key
        if (imageUrlOrKey.startsWith("http")) {
            const parsedUrl = new URL(imageUrlOrKey);
            filePath = parsedUrl.pathname.substring(1);
        }
        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePath
        }));
        console.log(`Successfully cleaned up S3 file: ${filePath}`);
    }
    catch (err) {
        console.error("Failed to delete S3 asset:", err);
    }
};
//# sourceMappingURL=imageService.js.map