import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";
import { toast } from "react-toastify";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/task");
      setTasks(res.data.tasks);
      setCurrentUserId(res.data.currentUserId);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTaskToState = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const updateTaskInState = (updatedTask) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task.uuid === updatedTask.uuid ? updatedTask : task,
      );
    });
  };

  const deleteTaskFromState = (uuid) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.uuid !== uuid));
  };

  const toggleLikeInState = (uuid, liked) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.uuid === uuid) {
          const currentCount = Number(task.like_count) || 0;
          return {
            ...task,
            is_liked: liked,
            like_count: liked ? currentCount + 1 : currentCount - 1,
          };
        }
        return task;
      }),
    );
  };
  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        updateTaskInState,
        deleteTaskFromState,
        getTasks,
        addTaskToState,
        toggleLikeInState,
        currentUserId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
// In TaskContext.jsx

export default TaskContext;
