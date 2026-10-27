import { uploadWebpImage } from "@Terminal/Supabase/imageStorage.js";
export const uploadAndOptimizeImage = async (fileBuffer, folder = "tasks") => {
    const uploadedImage = await uploadWebpImage(fileBuffer, folder, { width: 800, withoutEnlargement: true });
    return { newUrl: uploadedImage.url, uploadedFileName: uploadedImage.path };
};
export { deleteStoredImage } from "@Terminal/Supabase/imageStorage.js";
//# sourceMappingURL=imageService.js.map