// 📝 Append newly created posts straight to index 0 across both feeds
export const update_Created_Task_In_UseContext_State = (newTask, setTasks, setPrivateFeedTasks) => {
  setTasks((prevTasks) => [newTask, ...prevTasks]);
  setPrivateFeedTasks((prevJournalTasks) => [newTask, ...prevJournalTasks]);
};

// 🛠️ Filter out and dynamically re-insert modified task fields instantly
export const update_Patched_Task_In_UseContext_State = (updatedTask, setTasks, setPrivateFeedTasks) => {
  setTasks((prevTasks) => {
    const filtered = prevTasks.filter((task) => task.uuid !== updatedTask.uuid);
    const oldInstance = prevTasks.find((task) => task.uuid === updatedTask.uuid);
    const freshlyPolishedTask = { ...oldInstance, ...updatedTask };
    return [freshlyPolishedTask, ...filtered]; // 🚀 Pushes straight to index 0!
  });

  setPrivateFeedTasks((prevTasks) => {
    const filtered = prevTasks.filter((task) => task.uuid !== updatedTask.uuid);
    const oldInstance = prevTasks.find((task) => task.uuid === updatedTask.uuid);
    if (!oldInstance) return prevTasks; // If it's not currently visible in private feed, keep it as is
    const freshlyPolishedTask = { ...oldInstance, ...updatedTask };
    return [freshlyPolishedTask, ...filtered];
  });
};

// 🗑️ Instantly pull a post card out of your local arrays
export const deleteTaskFromState = (uuid, setTasks, setPrivateFeedTasks) => {
  setTasks((prevTasks) => prevTasks.filter((task) => task.uuid !== uuid));
  setPrivateFeedTasks((prevJournalTasks) =>
    prevJournalTasks.filter((task) => task.uuid !== uuid),
  );
};

// 🛡️ Safe recovery fallback splice system if network sync fails
export const restoreTaskToState = (restoredTask, originalIndex, setTasks, setPrivateFeedTasks) => {
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

// 💬 Optimistically inserts a comment and increments the counter instantly
export const update_Created_Comment_In_Context_State = (newComment, contentUuid, setComments, setTasks, setPrivateFeedTasks) => {
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

// 📡 Standard fetch loader overwrite
export const set_fetched_Comments_In_Context_State = (fetchedComments, contentUuid, setComments) => {
  setComments((prevComments) => ({
    ...prevComments,
    [contentUuid]: fetchedComments,
  }));
};
