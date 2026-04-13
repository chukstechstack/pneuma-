import React, { useState, useEffect } from "react";
import TaskInput from "./TaskInput";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    img: null,
    category: "",
    tags: "",
  });

  const navigate = useNavigate();

  const { title, content, img, category, tags } = formData;
  const handleFormData = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const submitTask = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    try {
      const res = await axios.post("http://localhost:3000/task", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({
        title: "",
        content: "",
        img: null,
        category: "",
        tags: "",
        user_id: "",
      });

      toast.success(res.data.message);
      navigate("/taskhome/home");
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      toast.error(message);
    }
  };

  useEffect(() => {
    return () => {
      if (img) URL.revokeObjectURL(img);
    };
  }, [img]);

  return (
    <div>
      <h1> Create A Testimony </h1> 
      <Link to="/taskhome/home" > Back</Link>
      <hr/> <br/> 

      <TaskInput
        title={title}
        content={content}
        img={img}
        category={category}
        tags={tags}
        handleFormData={handleFormData}
        submitTask={submitTask}
      />
    </div>
  );
};

export default CreateTask;
