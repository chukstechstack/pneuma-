import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";

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
      if (err.response?.status === 401) {
        console.log(
          "👤 User is currently a guest. Waiting for login/register...",
        );
      } else {
        console.error(err.response?.data?.error || err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addTaskToState = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const restoreTaskToState = (restoredTask, originalIndex) => {
    setTasks((prevTasks) => {
      const updated = [...prevTasks];
      updated.splice(originalIndex, 0, restoredTask);
      return updated;
    });
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const updateTaskInState = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.uuid === updatedTask.uuid ? updatedTask : task,
      ),
    );
  };

  const deleteTaskFromState = (uuid) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.uuid !== uuid));
  };

  // 🌟 FUNCTION 1: THE DATABASE SYNC OPERATOR (THE TRUTH)
  const updateSingleTaskInState = (updatedPost, type) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.uuid !== updatedPost.uuid) return task;

        const isField = type === "like" ? "is_liked" : "is_reposted";

        return {
          ...task,
          likes_count: updatedPost.likes_count,
          reposts_count: updatedPost.reposts_count,
          shares_count: updatedPost.shares_count,
          [isField]: task[isField], // Keep the active state matched to user action
        };
      }),
    );
  };

  // 🌟 FUNCTION 2: THE INSTANT ENGINE (OUR SNAP GUESSTIMATE)
  const toggleInteractionInState = (taskId, type) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.uuid !== taskId) return task;

        const luminaField = type === "like" ? "is_liked" : "is_reposted";
        const countField = type === "like" ? "likes_count" : "reposts_count";

        const currentlyActive = task[luminaField];

        return {
          ...task,
          [luminaField]: !currentlyActive,
          [countField]: currentlyActive
            ? Math.max(0, (Number(task[countField]) || 1) - 1)
            : (Number(task[countField]) || 0) + 1,
        };
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
        restoreTaskToState,
        getTasks,
        addTaskToState,
        currentUserId,
        updateSingleTaskInState, // For sealing the database truth
        toggleInteractionInState, // For running the blazing fast instant guess!
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
