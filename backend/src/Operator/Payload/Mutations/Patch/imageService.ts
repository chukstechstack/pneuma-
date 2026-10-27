import { deleteStoredImage, uploadWebpImage } from "@Terminal/Supabase/imageStorage.js";

export const uploadAndOptimizeImage = async (
  fileBuffer: Buffer,
  folder: string = "tasks"
): Promise<{ newUrl: string; uploadedFileName: string }> => {
  const uploadedImage = await uploadWebpImage(
    fileBuffer,
    folder,
    { width: 800, withoutEnlargement: true }
  );
  return { newUrl: uploadedImage.url, uploadedFileName: uploadedImage.path };
};

export { deleteStoredImage };