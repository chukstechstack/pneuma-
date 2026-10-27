import { deleteStoredImage, uploadWebpImage } from "@Terminal/Supabase/imageStorage.js";

export const processAndUploadImage = async (
  fileBuffer: Buffer,
  folder: string = "tasks"
): Promise<{ imgUrl: string; uploadedFileName: string }> => {
  const uploadedImage = await uploadWebpImage(
    fileBuffer,
    folder,
    { width: 800, withoutEnlargement: true }
  );
  return { imgUrl: uploadedImage.url, uploadedFileName: uploadedImage.path };
};

export { deleteStoredImage };