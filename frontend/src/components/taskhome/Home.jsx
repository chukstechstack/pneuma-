import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Task from "./taskInput.jsx";

const HomePage = () => {
  const [tasks, setTask] = useState([]);

  const navigate = useNavigate();
  const getTask = async () => {
    try {
      const res = await axios.get("http://localhost:3000/task", {
        withCredentials: true
      });
      setTask(res.data.tasks);
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      toast.error(message);
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  return (
    <div>
      <h1>Welcome</h1>
      {tasks.map((task, index) => {
        return (
          <div>
                  <button onClick={() => navigate("/createtask")}>CreateTask</button>
            <Task
              key={task.id}
              id={task.id}
              title={task.title}
              content={task.content}
              img={task.img}
              category={task.category}
              tags={task.tags}
              index={index}
            />
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
