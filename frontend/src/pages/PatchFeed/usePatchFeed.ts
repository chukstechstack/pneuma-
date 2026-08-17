import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateTask } from "@hooks/useTaskMutations";
import { useAuthStore } from "@store/useAuthStore.js";
import { Task, PaginatedTasks, FormState } from "./PatchFeed.types";

export const usePatchFeed = () => {
  // ─── Routing & Auth ───────────────────────────────
  const navigate = useNavigate();
  const { uuid } = useParams();
  const user = (useAuthStore() as any).user;
  const currentUserUuid: string | undefined = user?.uuid;
  const userUuid = currentUserUuid ?? "";

  // ─── Query Client & Task Lookup ───────────────────
  const queryClient = useQueryClient();

  const findTask = (): Task | undefined => {
    const journalData = queryClient.getQueryData<PaginatedTasks | undefined>(["journalFeed", currentUserUuid]);
    const homeData = queryClient.getQueryData<PaginatedTasks | undefined>(["homeFeed"]);

    return (
      journalData?.pages.flatMap((p) => p.tasks).find((t) => t.uuid === uuid) ||
      homeData?.pages.flatMap((p) => p.tasks).find((t) => t.uuid === uuid)
    );
  };

  const taskToEdit = findTask();

  // ─── Local Form State ─────────────────────────────
  const [formData, setFormData] = useState<FormState>({
    content: taskToEdit?.content || "",
    img: (taskToEdit?.img as unknown as File) || null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  // ─── Mutation ──────────────────────────────────────
  const { mutate: updateTask, isPending } = useUpdateTask(userUuid);

  // ─── Effects ───────────────────────────────────────
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ─── Handlers ──────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement & HTMLTextAreaElement;
    const files = (e.target as HTMLInputElement).files;

    if (name === "img" && files?.length) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, img: file }));

      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.content) data.append("content", formData.content);
    if (formData.img instanceof File) {
      data.append("img", formData.img);
    }

    updateTask(
      {
        uuid: uuid!,
        formData: data,
        content: formData.content,
        previewUrl,
      },
      {
        onSuccess: () => {
          navigate("/homefeed");
        },
      },
    );
  };

  // ─── Return ────────────────────────────────────────
  return {
    taskToEdit,
    formData,
    previewUrl,
    isPending,
    handleChange,
    handleSubmit,
    navigate,
  };
};