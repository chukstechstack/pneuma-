import { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios.js";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserUuid, setCurrentUserUuid] = useState(null);

  // Home Feed Pagination
  const [next_Post_Timestamp, set_Next_Post_Timestamp] = useState(null);
  const [has_Next_Post_Timestamp, set_Has_Next_Post_Timestamp] = useState(true);
  const requestIsInProgress = useRef(false);

  const freeze_time = useRef(String(Date.now()));

  const FreshLoad = useCallback(
    async (isFreshLoad = true) => {
      if (requestIsInProgress.current) return;
      if (!isFreshLoad && !has_Next_Post_Timestamp) return;

      requestIsInProgress.current = true;
      setLoading(true);

      try {
        if (isFreshLoad) {
          freeze_time.current = String(Date.now());
        }

        const is_FreshLoad = isFreshLoad
          ? "Yes_Is_FreshLoad"
          : next_Post_Timestamp;
        const res = await api.get(
          `/task?freeze_time=${freeze_time.current}&fresh_load=${is_FreshLoad}`,
        );

        setTasks((prev) =>
          isFreshLoad ? res.data.tasks : [...prev, ...res.data.tasks],
        );
        setCurrentUserId(res.data.currentUserId);
        setCurrentUserUuid(res.data.currentUserUuid);

        const next_post_timestamp = res.data.next_post_timestamp;
        set_Next_Post_Timestamp(next_post_timestamp);
        set_Has_Next_Post_Timestamp(Boolean(next_post_timestamp));
      } catch (err) {
        if (err.response?.status === 401) {
          console.log(
            "👤 User is currently a guest. Waiting for login/register...",
          );
        } else {
          console.error(err.response?.data?.error || err.message);
        }
      } finally {
        requestIsInProgress.current = false;
        setLoading(false);
      }
    },
    [next_Post_Timestamp, has_Next_Post_Timestamp],
  );

  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      FreshLoad(true);
      hasMounted.current = true;
    }
  }, [FreshLoad]);

  // Journal Page Pagination (Private Feed)
  const [privateFeedTasks, setPrivateFeedTasks] = useState([]);
  const [journalLoading, setJournalLoading] = useState(false);
  const [next_Journal_Timestamp, set_Next_Journal_Timestamp] = useState(null);
  const [has_Next_Journal_Timestamp, set_Has_next_Journal_Timestamp] =
    useState(true);
  const journal_Request_In_Progress = useRef(false);
  const journal_Freeze_Time = useRef(String(Date.now()));

  const privateFeedHandler = useCallback(
    async (cuurent_User_privateFeed_post_Uuid, isFreshLoad = true) => {
      if (
        !cuurent_User_privateFeed_post_Uuid ||
        cuurent_User_privateFeed_post_Uuid === "sanctuary"
      )
        return;
      if (journal_Request_In_Progress.current) return;
      if (!isFreshLoad && !has_Next_Journal_Timestamp) return;

      journal_Request_In_Progress.current = true;
      setJournalLoading(true);

      try {
        if (isFreshLoad) {
          console.log("🔄 Resetting journal timeline ceiling to 'now'");
          journal_Freeze_Time.current = String(Date.now());
        }

        const is_FreshLoad_Pointer = isFreshLoad
          ? "Yes_Is_FreshLoad"
          : next_Journal_Timestamp;

        const res = await api.get(
          `/task/journalfeed/${cuurent_User_privateFeed_post_Uuid}?freeze_time=${journal_Freeze_Time.current}&fresh_load=${is_FreshLoad_Pointer}`,
        );

        setPrivateFeedTasks((prev) =>
          isFreshLoad ? res.data.tasks : [...prev, ...res.data.tasks],
        );

        setCurrentUserId(res.data.currentUserId);

        const next_timestamp = res.data.next_post_timestamp;
        set_Next_Journal_Timestamp(next_timestamp);
        set_Has_next_Journal_Timestamp(Boolean(next_timestamp));
      } catch (err) {
        console.error("❌ Failed to fetch journal sanctuary posts:", err);
      } finally {
        journal_Request_In_Progress.current = false;
        setJournalLoading(false);
      }
    },
    [next_Journal_Timestamp, has_Next_Journal_Timestamp],
  );

  const update_Created_Task_In_UseContext_State = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setPrivateFeedTasks((prevJournalTasks) => [newTask, ...prevJournalTasks]);
  };

  const update_Patched_Task_In_UseContext_State = (updatedTask) => {
    setTasks((prevTasks) => {
      const filtered = prevTasks.filter(
        (task) => task.uuid !== updatedTask.uuid,
      );
      const oldInstance = prevTasks.find(
        (task) => task.uuid === updatedTask.uuid,
      );
      const freshlyPolishedTask = { ...oldInstance, ...updatedTask };
      return [freshlyPolishedTask, ...filtered]; // 🚀 Pushes straight to index 0!
    });

    setPrivateFeedTasks((prevTasks) => {
      const filtered = prevTasks.filter(
        (task) => task.uuid !== updatedTask.uuid,
      );
      const oldInstance = prevTasks.find(
        (task) => task.uuid === updatedTask.uuid,
      );
      if (!oldInstance) return prevTasks; // If it's not currently visible in private feed, keep it as is
      const freshlyPolishedTask = { ...oldInstance, ...updatedTask };
      return [freshlyPolishedTask, ...filtered];
    });
  };

  const deleteTaskFromState = (uuid) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.uuid !== uuid));
    setPrivateFeedTasks((prevJournalTasks) =>
      prevJournalTasks.filter((task) => task.uuid !== uuid),
    );
  };

  const restoreTaskToState = (restoredTask, originalIndex) => {
    setTasks((prevTasks) => {
      const updated = [...prevTasks];
      updated.splice(originalIndex, 0, restoredTask);
      return updated;
    });

    setPrivateFeedTasks((prevTasks) => {
      const updated = [...prevTasks];
      updated.splice(originalIndex, 0, restoredTask);
      return updated;
    });
  };

  // ── OPTIMISTIC STATE FLASH ENGINE ──
  const toggle_Engagement_In_React_State = (stableUuid, type) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.uuid !== stableUuid) return task;

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

    // Dynamic Flash for Private Feed (Handles instant clone creation/card removals)
    setPrivateFeedTasks((prevJournal) => {
      const existingInJournal = prevJournal.find((t) => t.uuid === stableUuid);

      if (type === "like") {
        return prevJournal.map((task) => {
          if (task.uuid !== stableUuid) return task;
          return {
            ...task,
            is_liked: !task.is_liked,
            likes_count: task.is_liked
              ? Math.max(0, task.likes_count - 1)
              : task.likes_count + 1,
          };
        });
      }

      if (type === "repost") {
        if (existingInJournal) {
          return prevJournal.filter((task) => task.uuid !== stableUuid);
        } else {
          const targetTask = tasks.find((t) => t.uuid === stableUuid);
          if (targetTask) {
            return [
              {
                ...targetTask,
                is_reposted: true,
                reposts_count: (Number(targetTask.reposts_count) || 0) + 1,
                is_repost_badge: true,
              },
              ...prevJournal,
            ];
          }
        }
      }
      return prevJournal;
    });
  };

  // ── 🔒 SECURED REAL-TIME SERVER RECONCILIATION DISPATCHER ──
  // FIXED: Added 'serverAction' to the input arguments block cleanly!
  const update_Engagement_frm_Database = (
    updatedPost,
    type,
    serverAction = null,
  ) => {
    const updatePostData = (task) => {
      if (task.uuid !== updatedPost.uuid) return task;

      let updatedTask = {
        ...task,
        likes_count: updatedPost.likes_count,
        reposts_count: updatedPost.repost_count,
        shares_count: updatedPost.shares_count,
      };

      if (type === "like") {
        if (serverAction === "added") updatedTask.is_liked = true;
        if (serverAction === "removed") updatedTask.is_liked = false;
      }

      if (type === "repost") {
        if (serverAction === "added") updatedTask.is_reposted = true;
        if (serverAction === "removed") updatedTask.is_reposted = false;
      }

      return updatedTask;
    };

    setTasks((prevTasks) => prevTasks.map(updatePostData));
    setPrivateFeedTasks((prevJournal) => prevJournal.map(updatePostData));
  };

  const update_Follow_Request_In_useContext_State = (authorProfileUuid) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.author_profile_uuid !== authorProfileUuid) return task;
        return { ...task, is_following: !task.is_following };
      }),
    );
  };

  // ── COMMENTS ARCHITECTURE MEMORY ──
  const [comments, setComments] = useState({});

  // 🎯 FUNCTION A: Optimistically inserts a comment and increments the counter instantly
  const update_Created_Comment_In_Context_State = (newComment, contentUuid) => {
    setComments((prevComments) => {
      const currentPostComments = prevComments[contentUuid] || [];
      return {
        ...prevComments,
        [contentUuid]: [newComment, ...currentPostComments],
      };
    });

    const incrementCommentCounter = (task) => {
      if (task.uuid !== contentUuid) return task;
      return {
        ...task,
        comments_count: (Number(task.comments_count) || 0) + 1,
      };
    };

    setTasks((prevTasks) => prevTasks.map(incrementCommentCounter));
    setPrivateFeedTasks((prevJournalTasks) =>
      prevJournalTasks.map(incrementCommentCounter),
    );
  };

  // 🎯 FUNCTION B: Standard fetch loader overwrite
  const set_fetched_Comments_In_Context_State = (
    fectchedComments,
    contentUuid,
  ) => {
    setComments((prevComments) => ({
      ...prevComments,
      [contentUuid]: fectchedComments,
    }));
  };

  const [followStates, setFollowStates] = useState({});
  const update_Global_Follow_Toggle = async (
    author_profile_uuid,
    currentServerStatus,
  ) => {
    // 1. Find the current status using a clean if/else block
    let currentStatus;

    if (followStates[author_profile_uuid] !== undefined) {
      currentStatus = followStates[author_profile_uuid];
    } else {
      currentStatus = currentServerStatus;
    }

    // 2. Calculate what the next status should be instantly
    let optimisticNextStatus;

    if (currentStatus === null) {
      optimisticNextStatus = "pending";
    } else {
      optimisticNextStatus = null;
    }

    // 3. Save the previous state in case the network fails
    const previousStatus = currentStatus;

    // 4. Update our scoreboard instantly so the screen flips
    setFollowStates((prevScoreboard) => {
      return {
        ...prevScoreboard,
        [author_profile_uuid]: optimisticNextStatus,
      };
    });

    // 5. Fire the network request in the background
    try {
      const res = await api.post(`/task/profile/follow/${author_profile_uuid}`);

      // Check what the backend confirmed (true = pending, false = deleted/null)
      let confirmedStatus;
      if (res.data.isFollowing) {
        confirmedStatus = "pending";
      } else {
        confirmedStatus = null;
      }

      // Sync the scoreboard with the exact truth from the database
      setFollowStates((prevScoreboard) => {
        return {
          ...prevScoreboard,
          [author_profile_uuid]: confirmedStatus,
        };
      });
    } catch (err) {
      console.error(
        "❌ Follow sync failed, rolling back changes...",
        err.message,
      );
      alert("Network error: Could not sync follow request. Reverting status.");

      // 6. AUTOMATIC ROLLBACK: Put the scoreboard back to what it was before the click
      setFollowStates((prevScoreboard) => {
        return {
          ...prevScoreboard,
          [author_profile_uuid]: previousStatus,
        };
      });
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        update_Patched_Task_In_UseContext_State,
        deleteTaskFromState,
        restoreTaskToState,
        FreshLoad,
        update_Created_Task_In_UseContext_State,
        currentUserId,
        update_Engagement_frm_Database,
        toggle_Engagement_In_React_State,
        currentUserUuid,
        update_Follow_Request_In_useContext_State,
        privateFeedTasks, // Preserves backward mapping configurations safely
        journalLoading,
        privateFeedHandler,
        has_Next_Post_Timestamp,
        has_Next_Journal_Timestamp,
        comments,
        update_Created_Comment_In_Context_State,
        set_fetched_Comments_In_Context_State,
        followStates,
        update_Global_Follow_Toggle,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
