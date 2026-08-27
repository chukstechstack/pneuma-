import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@Terminal/Aws/AwsS3ClientConfig.js";

/**
 * Optimizes an image buffer using Sharp and uploads it to AWS S3.
 * Returns the public S3 URL and the uploaded file name (key).
 */
export const processAndUploadImage = async (
  fileBuffer: Buffer,
  folder: string = "tasks"
): Promise<{ imgUrl: string; uploadedFileName: string }> => {
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

  const imgUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadedFileName}`;

  return { imgUrl, uploadedFileName };
};

/**
 * Deletes an image object from AWS S3 (useful for rollbacks or old image cleanup).
 */
export const deleteImageFromS3 = async (fileNameOrUrl: string) => {
  try {
    let filePath = fileNameOrUrl;
    // If a full URL was passed, parse out the key path
    if (fileNameOrUrl.startsWith("http")) {
      const parsedUrl = new URL(fileNameOrUrl);
      filePath = parsedUrl.pathname.substring(1);
    }

    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePath
    }));
    console.log(`Successfully cleaned up S3 file: ${filePath}`);
  } catch (err) {
    console.error("Failed to delete S3 asset:", err);
  }
};