import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAuthStore } from "@store/useAuthStore.js";
import { FormDataType } from "./CreateTask.types";
import { useCreateTaskMutation } from "./useMutation";

export const useCreateTask = () => {
  const { userUuid } = useAuthStore() as { userUuid: string | null };

  const [formData, setFormData] = useState<FormDataType>({
    content: "",
    img: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const mutation = useCreateTaskMutation(userUuid, previewUrl);

  const handleFormData = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;

    if (target instanceof HTMLInputElement) {
      const { name, value, files } = target;
      if (name === "img" && files?.length) {
        const file = files[0];
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setFormData((prev) => ({ ...prev, img: file }));
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    const { name, value } = target as HTMLTextAreaElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    mutation.mutate(data);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    formData,
    previewUrl,
    isPending: mutation.isPending,
    handleFormData,
    submitTask,
  };
};