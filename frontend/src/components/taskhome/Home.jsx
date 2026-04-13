import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Task from "./taskInput.jsx";
import api from "../../api/axios.js";

const HomePage = () => {
  const [tasks, setTask] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/task");
      setTask(res.data.tasks);
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const logout = async () => {
    try {
      const res = await api.post("/auth/logout");

      toast.success(res.data.message);
      navigate("/auth/login");
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      toast.error(message);
      console.log(err);
    }
  };

  const deleteTask = async (uuid) => {
    try {
      const res = await api.delete(`/task/${uuid}`);

      toast.success(res.data.message);
      getTasks();
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      toast.error(message);
      console.log(err);
    }
  };

  return (
    <div>
      <h1> Welcome to Pnuma</h1>
      <h2>Testimony feed </h2>

      <div>
        <button onClick={logout}> logout</button>
        <button onClick={() => navigate("/createtask")}>CreateTask</button>

        <hr />
      </div>
      {loading ? (
        <p> Loading...</p>
      ) : (
        <div>
          {tasks.map((task) => {
            return (
              <Task
                key={task.id}
                uuid={task.uuid}
                title={task.title}
                content={task.content}
                img={task.img}
                category={task.category}
                tags={task.tags}
                deleteTask={deleteTask}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;
