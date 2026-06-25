import { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios.js";
import { io } from "socket.io-client";

// Import your synchronous state mutators
import {
  update_Created_Task_In_UseContext_State,
  update_Patched_Task_In_UseContext_State,
  deleteTaskFromState,
  restoreTaskToState,
  update_Created_Comment_In_Context_State,
  set_fetched_Comments_In_Context_State,
} from "./operations/CrudmOp.js";

import {
  toggle_Engagement_In_React_State,
  update_Engagement_frm_Database,
  update_Global_Follow_Toggle,
} from "./operations/Engagement.js";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  // ----------------------------------------------------
  // 🌍 1. GLOBAL TIMELINE STREAM STATE
  // ----------------------------------------------------
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserUuid, setCurrentUserUuid] = useState(null);
  const [next_Post_Timestamp, set_Next_Post_Timestamp] = useState(null);
  const [has_Next_Post_Timestamp, set_Has_Next_Post_Timestamp] = useState(true);
  const requestInProgress = useRef(false);
  const freeze_time = useRef(String(Date.now()));

  // ----------------------------------------------------
  // 🔒 2. PRIVATE SANCTUARY JOURNAL STATE
  // ----------------------------------------------------
  const [privateFeedTasks, setPrivateFeedTasks] = useState([]);
  const [journalLoading, setJournalLoading] = useState(false);
  const [next_Journal_Timestamp, set_Next_Journal_Timestamp] = useState(null);
  const [has_Next_Journal_Timestamp, set_Has_next_Journal_Timestamp] =
    useState(true);
  const journalInProgress = useRef(false);
  const journal_Freeze_Time = useRef(String(Date.now()));

  // Other contextual memory anchors
  const [comments, setComments] = useState({});
  const [followStates, setFollowStates] = useState({});
  const [socket, setSocket] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);

  // ----------------------------------------------------
  // ⚙️ 3. CORE HANDLERS (Brought Inside the House!)
  // ----------------------------------------------------

  // 🌍 Global Feed Handler: Runs natively inside your state space
  const privateFreshLoadHandler = useCallback(
    async (isFreshLoad = true) => {
      if (requestInProgress.current) return;
      if (!isFreshLoad && !has_Next_Post_Timestamp) return;

      requestInProgress.current = true;
      setLoading(true);

      try {
        if (isFreshLoad) {
          freeze_time.current = String(Date.now());
        }

        const is_FreshLoad_Pointer = isFreshLoad
          ? "Yes_Is_FreshLoad"
          : next_Post_Timestamp;
        const res = await api.get(
          `/task?freeze_time=${freeze_time.current}&fresh_load=${is_FreshLoad_Pointer}`,
        );

        setTasks((prev) =>
          isFreshLoad ? res.data.tasks : [...prev, ...res.data.tasks],
        );
        setCurrentUserId(res.data.currentUserId);
        setCurrentUserUuid(res.data.currentUserUuid);

        const next_post_ts = res.data.next_post_timestamp;
        set_Next_Post_Timestamp(next_post_ts);
        set_Has_Next_Post_Timestamp(Boolean(next_post_ts));
      } catch (err) {
        if (err.response?.status === 401) {
          console.log(
            "👤 User is currently a guest. Waiting for login/register...",
          );
        } else {
          console.error(err.response?.data?.error || err.message);
        }
      } finally {
        requestInProgress.current = false;
        setLoading(false);
      }
    },
    [next_Post_Timestamp, has_Next_Post_Timestamp],
  );

  // 🔒 Private Feed Handler: No more passing 11 arguments down a pipeline!
  const privateJournalFeedHandler = useCallback(
    async (targetUserUuid, isFreshLoad = true) => {
      if (!targetUserUuid || targetUserUuid === "sanctuary") return;
      if (journalInProgress.current) return;
      if (!isFreshLoad && !has_Next_Journal_Timestamp) return;

      journalInProgress.current = true;
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
          `/task/journalfeed/${targetUserUuid}?freeze_time=${journal_Freeze_Time.current}&fresh_load=${is_FreshLoad_Pointer}`,
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
        journalInProgress.current = false;
        setJournalLoading(false);
      }
    },
    [next_Journal_Timestamp, has_Next_Journal_Timestamp],
  );

  // ----------------------------------------------------
  // 🌀 4. AUTOMATIC SIDE EFFECTS (Mounted Run Triggers)
  // ----------------------------------------------------

  // Seed the timeline stream immediately upon booting
  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      privateFreshLoadHandler(true);
      hasMounted.current = true;
    }
  }, [privateFreshLoadHandler]);

  // Real-time network listener mapping
  useEffect(() => {
    if (!currentUserUuid) return;

    const socketURL = import.meta.env.DEV
      ? "http://localhost:3000"
      : "https://pneuma-api-0bvr.onrender.com";
    const newSocket = io(socketURL, { withCredentials: true });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(
        "⚡ Living network connection established. Socket ID:",
        newSocket.id,
      );
      newSocket.emit("current_Logged_In_User_Uuid", {
        userUuid: currentUserUuid,
      });
    });

    newSocket.on("incoming_follow_request", (payload) => {
      console.log("🔔 Socket caught an incoming connection alert:", payload);
      setPendingRequests((prevRequests) => [payload, ...prevRequests]);
    });

    return () => {
      newSocket.disconnect();
      console.log("🔌 Live phone line closed down.");
    };
  }, [currentUserUuid]);

  // Historical request parser
  useEffect(() => {
    if (!currentUserUuid) return;

    const pullOldRequests = async () => {
      try {
        const res = await api.get("/task/profile/pending-requests");
        setPendingRequests(res.data.requests);
        console.log(
          "📥 Historical pending requests successfully seeded:",
          res.data.requests,
        );
      } catch (err) {
        console.error(
          "❌ Failed to pull old pending follow requests:",
          err.message,
        );
      }
    };

    pullOldRequests();
  }, [currentUserUuid]);

  // Update requests status for Profile
  // Inside TaskContext.jsx
  useEffect(() => {
    if (socket) {
      socket.on("connection_status_updated", (data) => {
        // 1. Update the local followStates object
        setFollowStates((prev) => ({
          ...prev,
          [data.authorUuid]: data.newStatus,
        }));

        // 2. Optional: Remove the request from the pending list if they are on that page
        setPendingRequests((prev) =>
          prev.filter((req) => req.sender_uuid !== data.senderUuid),
        );
      });
    }

    return () => socket.off("connection_status_updated");
  }, [socket]);
  const Handle_Decline_Accept_Action = async (followerUuid, action) => {
    const backupRequests = [...pendingRequests];

    // 1. Optimistic Update (The UI feels instant)
    setPendingRequests((prev) =>
      prev.filter((req) => req.followerUuid !== followerUuid),
    );

    try {
      // 2. Wait for the 'Receipt' from the server
      const response = await api.patch("/task/profile/request-action", {
        followerUuid,
        action,
      });

      // 3. Optional: Verify the receipt
      console.log("Server confirmed:", response.data.message);

      // If you need to update followStates based on the server's specific confirmation:
      if (response.data.status) {
        setFollowStates((prev) => ({
          ...prev,
          [followerUuid]: response.data.status,
        }));
      }
    } catch (err) {
      // 4. The Safety Net: If the server fails, restore the pile
      console.error("Api failed, rolling back UI", err.message);
      setPendingRequests(backupRequests);
      alert("Something went wrong. Please check your connection.");
    }
  };
  // ----------------------------------------------------
  // 🛠️ 5. COMPONENT OPERATIONS MAPPINGS
  // ----------------------------------------------------
  const handleCreateTask = (newTask) =>
    update_Created_Task_In_UseContext_State(
      newTask,
      setTasks,
      setPrivateFeedTasks,
    );
  const handlePatchTask = (updatedTask) =>
    update_Patched_Task_In_UseContext_State(
      updatedTask,
      setTasks,
      setPrivateFeedTasks,
    );
  const handleDeleteTask = (uuid) =>
    deleteTaskFromState(uuid, setTasks, setPrivateFeedTasks);
  const handleRestoreTask = (restoredTask, originalIndex) =>
    restoreTaskToState(
      restoredTask,
      originalIndex,
      setTasks,
      setPrivateFeedTasks,
    );

  const handleCreateComment = (newComment, contentUuid) =>
    update_Created_Comment_In_Context_State(
      newComment,
      contentUuid,
      setComments,
      setTasks,
      setPrivateFeedTasks,
    );
  const handleSetFetchedComments = (fetchedComments, contentUuid) =>
    set_fetched_Comments_In_Context_State(
      fetchedComments,
      contentUuid,
      setComments,
    );

  const handleToggleEngagement = (stableUuid, type) =>
    toggle_Engagement_In_React_State(
      stableUuid,
      type,
      setTasks,
      setPrivateFeedTasks,
      tasks,
    );
  const handleUpdateEngagementFromDb = (updatedPost, type, serverAction) =>
    update_Engagement_frm_Database(
      updatedPost,
      type,
      serverAction,
      setTasks,
      setPrivateFeedTasks,
    );
  const handleGlobalFollowToggle = async (
    author_profile_uuid,
    currentServerStatus,
  ) =>
    await update_Global_Follow_Toggle(
      author_profile_uuid,
      currentServerStatus,
      followStates,
      setFollowStates,
    );

  // ----------------------------------------------------
  // 🔌 6. THE ROOM SERVICE WINDOW (Return Statement)
  // ----------------------------------------------------
  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        currentUserId,
        currentUserUuid,
        privateFeedTasks,
        journalLoading,
        has_Next_Post_Timestamp,
        has_Next_Journal_Timestamp,
        comments,
        followStates,
        socket,
        pendingRequests,
        setPendingRequests,
        Handle_Decline_Accept_Action,

        // Unified cleanly mapped functions!
        FreshLoad: privateFreshLoadHandler,
        getTasks: privateFreshLoadHandler,
        privateFeedHandler: privateJournalFeedHandler,

        update_Created_Task_In_UseContext_State: handleCreateTask,
        update_Patched_Task_In_UseContext_State: handlePatchTask,
        deleteTaskFromState: handleDeleteTask,
        restoreTaskToState: handleRestoreTask,

        toggle_Engagement_In_React_State: handleToggleEngagement,
        update_Engagement_frm_Database: handleUpdateEngagementFromDb,

        update_Created_Comment_In_Context_State: handleCreateComment,
        set_fetched_Comments_In_Context_State: handleSetFetchedComments,
        update_Global_Follow_Toggle: handleGlobalFollowToggle,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
