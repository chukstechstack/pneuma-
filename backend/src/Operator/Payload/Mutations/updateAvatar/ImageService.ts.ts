import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@Terminal/Aws/AwsS3ClientConfig.js";

export const processAndUploadAvatar = async (
  fileBuffer: Buffer,
  userUuid: string
): Promise<{ avatarUrl: string; uploadedFileName: string; bufferLength: number }> => {
  const optimizedBuffer = await sharp(fileBuffer)
    .resize({ width: 400, height: 400, fit: "cover", position: "entropy" })
    .webp({ quality: 85 })
    .toBuffer();

  const uploadedFileName = `avatars/${userUuid}/${Date.now()}-avatar.webp`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uploadedFileName,
      Body: optimizedBuffer,
      ContentType: "image/webp",
      CacheControl: "max-age=31536000",
    })
  );

  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  const avatarUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uploadedFileName}`;

  return {
    avatarUrl,
    uploadedFileName,
    bufferLength: optimizedBuffer.length,
  };
};

export const deleteAvatarFromS3 = async (uploadedFileName: string) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uploadedFileName,
      })
    );
    console.log(`Successfully cleaned up orphan S3 avatar file: ${uploadedFileName}`);
  } catch (s3DeleteErr: unknown) {
    const s3DeleteErrMsg = s3DeleteErr instanceof Error ? s3DeleteErr.message : String(s3DeleteErr);
    console.error("Critical: Failed to clean up orphan S3 avatar asset:", s3DeleteErrMsg);
  }
};