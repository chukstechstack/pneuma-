import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserUuid, setCurrentUserUuid] = useState(null);

  // 🔽 1. ADD NEW JOURNAL FEED STATES
  const [journalTasks, setJournalTasks] = useState([]); 
  const [journalLoading, setJournalLoading] = useState(false); 

  const getTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/task");
      setTasks(res.data.tasks);
      setCurrentUserId(res.data.currentUserId);
      setCurrentUserUuid(res.data.currentUserUuid);
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

  // 🔽 2. ADD THE DETAILED JOURNAL DATA FETCH PIPELINE
  const getJournalFeed = useCallback(async (journalOwnerUuid) => {
    setJournalLoading(true); // Turn spinner ON instantly!
    try {
      const res = await api.get(`/task/journalfeed/${journalOwnerUuid}`);
      setJournalTasks(res.data.tasks); // Automatically saves posts array on arrival!
    } catch (err) {
      console.error("❌ Failed to fetch your sanctuary journal profile:", err);
      setJournalTasks([]); // Safe fallback on error
    } finally {
      setJournalLoading(false); // Turn spinner OFF automatically when done!
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
          [isField]: task[isField], 
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

  // 🌟 FUNCTION 3: THE INSTANT FOLLOW ENGINE (OUR OPTIMISTIC SNAP SWAP)
  const toggleFollowInState = (authorProfileUuid) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.author_profile_uuid !== authorProfileUuid) return task;

        const currentlyFollowing = task.is_following;

        return {
          ...task,
          is_following: !currentlyFollowing, 
        };
      })
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
        updateSingleTaskInState, 
        toggleInteractionInState, 
        currentUserUuid,
        toggleFollowInState,
        // 🔽 3. EXPORT THE NEW STATE DATA VARIABLES AND FETCH LOGIC HOOKS
        journalTasks,
        journalLoading,
        getJournalFeed
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
