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
  Global_Engagement_Updater_For_Connect_Request,
} from "./operations/Engagement.js";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  // ----------------------------------------------------
  // 🌍 1. Home_Feed_States
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

  // ----------------------------------------------------
  // ⚙️ 3.Engagement & COmment States
  // ----------------------------------------------------
  const [comments, setComments] = useState({});

  const [pendingRequests, setPendingRequests] = useState([]);

  // ==================================================================
  //                 HOME FEED
  // ==================================================================
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
  //  // ------------------------END-----------------------------------

  // ==================================================================
  //                 PRIVATE JOURNAL FEED
  // ==================================================================
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

  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      privateFreshLoadHandler(true);
      hasMounted.current = true;
    }
  }, [privateFreshLoadHandler]);

  // ------------------------END-----------------------------------

  // ==================================================================
  // 3. Socket Configuration Setup
  // ==================================================================
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!currentUserUuid) return;

    const socketURL = import.meta.env.DEV
      ? "http://localhost:3000"
      : "https://pneuma-api-0bvr.onrender.com";

    const newSocket = io(socketURL, { withCredentials: true });

    newSocket.on("connect", () => {
      console.log(
        "⚡ Living network connection established. Socket ID:",
        newSocket.id,
      );
      newSocket.emit("current_Logged_In_User_Uuid", {
        userUuid: currentUserUuid,
      });
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [currentUserUuid]);
  // ------------------------END-----------------------------------

  // ==================================================================
  // 4.              CONNECTION REQUEST
  // ==================================================================
  const [engagement_Request_Status, set_engagement_Request_Status] = useState(
    {},
  );
  const [refreshCounter, setRefreshCounter] = useState(0);
  const Global_Engagement_Updater_For_Connect_Request = async (
    author_profile_uuid,
    currentTaskRelationStatus,
    engagement_Request_Status,
    set_engagement_Request_Status,
  ) =>
    await Global_Engagement_Updater_For_Connect_Request(
      author_profile_uuid,
      currentTaskRelationStatus,
      engagement_Request_Status,
      set_engagement_Request_Status,
    );

  //--------------------Active_Connect_Request------------------
  useEffect(() => {
    if (!socket) return;

    const handleIncomingRequest = (payload) => {
      console.log("🔔 Socket caught an incoming connection alert:", payload);
      setPendingRequests((prevRequests) => [payload, ...prevRequests]);
    };

    socket.on("incoming_connect_request", handleIncomingRequest);

    return () => {
      socket.off("incoming_connect_request", handleIncomingRequest);
    };
  }, [socket]);
  // -------------------Active_unCOnnect_Request-------------------
  useEffect(() => {
    if (!socket) return;
    const handleStatusChange = (payload) => {
      set_engagement_Request_Status((prev) => ({
        ...prev,
        [payload.followerUuid]: payload.newStatus,
      }));
    };

    socket.on("unConnect_Status_Changes", handleStatusChange);

    return () => {
      socket.off("unConnect_Status_Changes", handleStatusChange);
    };
  }, [socket]);

  // ----------Accept_Decline_Request--------------------
  const Handle_Decline_Accept_Action = async (requested_User_Uuuid, action) => {
    const backupRequests = [...pendingRequests];

    setPendingRequests((prev) =>
      prev.filter((req) => req.requested_User_Uuuid !== requested_User_Uuuid),
    );

    try {
      const response = await api.patch("/task/profile/request-action", {
        requested_User_Uuuid,
        action,
      });

      if (response.data.status) {
        (set_engagement_Request_Status,
          (prev) => ({
            ...prev,
            [requested_User_Uuuid]: response.data.status,
            set_engagement_Request_Status,
          }));

        setRefreshCounter((prev) => prev + 1);
      }
    } catch (err) {
      if (err.response) {
        console.error(
          "Server responded with:",
          err.response.status,
          err.response.data,
        );
      } else if (err.request) {
        console.error("No response received from server:", err.request);
      } else {
        console.error("Error setting up request:", err.message);
      }

      setPendingRequests(backupRequests);
      alert("Action failed. Check console for details.");
    }
  };

  // ---------Active_Update_Accept_&_Decline_For_Author-------------
  useEffect(() => {
    if (socket) {
      socket.on("connection_status_updated", (data) => {
        (set_engagement_Request_Status,
          (prev) => ({
            ...prev,
            [data.authorUuid]: data.newStatus,
          }));
        setPendingRequests((prev) =>
          prev.filter((req) => req.sender_uuid !== data.senderUuid),
        );
      });
      socket.on("connection_updated", () => {
        console.log("🔄 Real-time broadcast: Updating Inner Circle dock...");
        setRefreshCounter((prev) => prev + 1);
      });
    }

    return () => {
      if (socket) {
        socket.off("connection_status_updated");
        socket.off("connection_updated");
      }
    };
  }, [socket]);
  //---------------------------END---------------------------------------------

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
        engagement_Request_Status,
        set_engagement_Request_Status,
        socket,
        pendingRequests,
        setPendingRequests,

        Handle_Decline_Accept_Action,
        refreshCounter,

        setRefreshCounter,

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
        Global_Engagement_Updater_For_Connect_Request,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
