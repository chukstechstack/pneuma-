import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios.js";
import { FormDataType } from "./CreateTask.types";

export const useCreateTask = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormDataType>({
    content: "",
    img: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");

  const mutation = useMutation<any, any, FormData>({
    mutationFn: (data: FormData) => api.post("/task", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
          navigate("/homefeed");
    },
    
  });

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