import api from "../../api/axios.js";

// ── OPTIMISTIC STATE FLASH ENGINE (LIKES & REPOSTS) ──
export const toggle_Engagement_In_React_State = (stableUuid, type, setTasks, setPrivateFeedTasks, currentTasksArray) => {
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
        const targetTask = currentTasksArray.find((t) => t.uuid === stableUuid);
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
export const update_Engagement_frm_Database = (updatedPost, type, serverAction, setTasks, setPrivateFeedTasks) => {
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


// ── 🔒 OPTIMISTIC INLINE FOLLOW TIMELINE TOGGLE ──
export const update_Global_Follow_Toggle = async (author_profile_uuid, currentServerStatus, followStates, setFollowStates) => {
  // 1. Find the current status using a clean if/else block
  let currentStatus;

  if (followStates[author_profile_uuid] !== undefined) {
    currentStatus = followStates[author_profile_uuid];
  } else {
    currentStatus = currentServerStatus;
  }
  let optimisticNextStatus;
  if (currentStatus === null) {
    optimisticNextStatus = "pending";
  } else {
    optimisticNextStatus = null;
  }
  const previousStatus = currentStatus;
  setFollowStates((prevScoreboard) => {
    return {
      ...prevScoreboard,
      [author_profile_uuid]: optimisticNextStatus,
    };
  });


  try {
    const res = await api.post(`/task/profile/follow/${author_profile_uuid}`);
    let confirmedStatus;
    if (res.data.isFollowing) {
      confirmedStatus = "pending";
    } else {
      confirmedStatus = null;
    }


    setFollowStates((prevScoreboard) => {
      return {
        ...prevScoreboard,
        [author_profile_uuid]: confirmedStatus,
      };
    });
  } catch (err) {
    console.error("❌ Follow sync failed, rolling back changes...", err.message);
    alert("Network error: Could not sync follow request. Reverting status.");

    setFollowStates((prevScoreboard) => {
      return {
        ...prevScoreboard,
        [author_profile_uuid]: previousStatus,
      };
    });
  }
};
