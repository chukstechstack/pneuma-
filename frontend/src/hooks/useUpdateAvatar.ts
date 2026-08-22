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
            return api.put("/task/profile/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },

        onMutate: async (file: File): Promise<UpdateAvatarContext> => {
            await queryClient.cancelQueries({ queryKey: profileKey });

            const prevProfile = queryClient.getQueryData(profileKey);

            // Optional: Optimistically update the avatar preview locally if desired
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
            console.error("Failed to update avatar:", err);
        },

        onSuccess: (response: any) => {
            console.log("Avatar updated successfully:", response);
            // If backend returns the definitive server URL, update cache with it
            const newAvatarUrl = response?.data?.avatar_url || response?.avatar_url;
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
            queryClient.invalidateQueries({ queryKey: profileKey });
        },
    });
};