import { uploadWebpImage } from "@Terminal/Supabase/imageStorage.js";

export const processAndUploadAvatar = async (
  fileBuffer: Buffer,
  userUuid: string
): Promise<{ avatarUrl: string; uploadedFileName: string; bufferLength: number }> => {
  const uploadedImage = await uploadWebpImage(
    fileBuffer,
    `avatars/${userUuid}`,
    { width: 400, height: 400, fit: "cover", position: "entropy" },
    85
  );

  return {
    avatarUrl: uploadedImage.url,
    uploadedFileName: uploadedImage.path,
    bufferLength: uploadedImage.bufferLength,
  };
};