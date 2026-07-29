import React from "react";

export interface PatchInputProps {
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  content: string;
  img: File | string | null;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  previewUrl?: string;
  isPending: boolean;
}