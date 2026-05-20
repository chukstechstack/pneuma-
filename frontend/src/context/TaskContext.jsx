import { createContext, useState, useEffect, useCallback} from "react";
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
      // Insert the task at its original index without deleting anything (0)
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
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};


export default TaskContext;
