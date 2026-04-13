import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TaskInput from "./editInput.jsx";
import { toast } from "react-toastify";
import api from "../../api/axios.js";

const EditPost = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    img: "",
    tags: "",
    category: "",
  });
  const { title, content, img, tags, category } = formData;

  useEffect(() => {
    api
      .get(`/task/posts/${uuid}`)
      .then((res) => {
        setFormData({
          title: res.data.title || "",
          content: res.data.content || "",
          img: res.data.img || "",
          tags: Array.isArray(res.data.tags)
            ? res.data.tags.join(", ")
            : res.data.tags || "",
          category: res.data.category || "",
        });
      })
      .catch((err) => {
        const message = err.response?.data?.error || err.message;
        toast.error(message);
      });
  }, [uuid]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (title) data.append("title", title);
    if (content) data.append("content", content);
    if (category) data.append("category", category);
    if (tags) data.append("tags", tags);
    if (img instanceof File) {
      data.append("img", img);
    }
    try {
      const res = await api.patch(`/task/${uuid}`, data);
      setFormData({
        title: "",
        content: "",
        img: "",
        tags: "",
        category: "",
      });
      navigate("/taskhome/home");
      toast.success(res.data.message);
    } catch (err) {
      const message = err.response?.data?.error || "Update failed";
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
      <h1> Edit Post </h1>

      <Link to="/taskhome/home"> Back</Link>
      <div>
        <TaskInput
          handleChange={handleChange}
          {...formData}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
export default EditPost;
