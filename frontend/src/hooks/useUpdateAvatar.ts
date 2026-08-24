import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

interface UpdateAvatarContext {
    prevProfile: any;
}

export const useUpdateAvatar = (targetUserUuid?: string) => {
    const queryClient = useQueryClient();
    const profileKey = ["profileFeed", targetUserUuid];

    return useMutation<any, any, File, UpdateAvatarContext>({
        mutationFn: (file: File) => {
            const formData = new FormData();
            formData.append("avatar", file);

            console.log("📤 [useUpdateAvatar] Sending file payload:", {
                name: file.name,
                size: file.size,
                type: file.type,
            });

            return api.put("/task/profile/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },

        onMutate: async (file: File): Promise<UpdateAvatarContext> => {
            await queryClient.cancelQueries({ queryKey: profileKey });

            const prevProfile = queryClient.getQueryData(profileKey);

            // Optimistic preview via local object URL
            const previewUrl = URL.createObjectURL(file);
            queryClient.setQueryData(profileKey, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    profile: {
                        ...old.profile,
                        avatar_url: previewUrl,
                    },
                };
            });

            return { prevProfile };
        },

        onError: (err: any, file: File, context: UpdateAvatarContext | undefined) => {
            if (context?.prevProfile) {
                queryClient.setQueryData(profileKey, context.prevProfile);
            }
            console.error("❌ [useUpdateAvatar] Failed to update avatar:", err);
        },

        onSuccess: (response: any) => {
            // Axios places response body inside response.data
            const responseData = response?.data || response;
            console.log("📥 [useUpdateAvatar] Success response data:", responseData);

            const newAvatarUrl = responseData?.avatar_url || responseData?.profile?.avatar_url;
            console.log("🔗 [useUpdateAvatar] Extracted new avatar URL:", newAvatarUrl);

            if (newAvatarUrl) {
                queryClient.setQueryData(profileKey, (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        profile: {
                            ...old.profile,
                            avatar_url: newAvatarUrl,
                        },
                    };
                });
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["profileFeed"] });
        },
    });
};