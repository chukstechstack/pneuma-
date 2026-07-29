import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios.js";
import TaskInput from "@components/CreateTaskInput.jsx";
import "@styles/CreateTask.css";

interface FormDataType {
  content: string;
  img: File | null;
}

const CreateTask = () => {
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

    // HTMLTextAreaElement
    const { name, value } = target as HTMLTextAreaElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const submitTask =(e: React.SubmitEvent<HTMLFormElement>)=> {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    mutation.mutate(data);
    navigate("/home");
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <main className="create-task-layout">
      <section className="create-task-container">
        <header className="create-task-header">
          <Link to="/home">← Back</Link>
          <h1>Document a Testimony</h1>
        </header>

        <TaskInput
          content={formData.content}
          img={formData.img}
          handleFormData={handleFormData}
          submitTask={submitTask}
          isPending={mutation.isPending}
          previewUrl={previewUrl}
        />
      </section>
    </main>
  );
};

export default CreateTask;
