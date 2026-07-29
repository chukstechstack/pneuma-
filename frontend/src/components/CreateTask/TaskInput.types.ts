import React from "react";

export type TaskInputProps = {
  img: File | null;
  submitTask: React.FormEventHandler<HTMLFormElement>;
  content: string;
  handleFormData: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isPending: boolean;
  previewUrl?: string | null;
};