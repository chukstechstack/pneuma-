import React, { useState, useContext, useEffect } from "react";
import api from "../api/axios.js";
import TaskContext from "../context/TaskContext.jsx";

const CommentDrawer = ({ contentUuid, onClose }) => {
  const {
    tasks,
    currentUserId,
    comments,
    update_Created_Comment_In_Context_State,
    set_fetched_Comments_In_Context_State,
  } = useContext(TaskContext);

  const thisPostComments = comments[contentUuid] || [];
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadComment = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`task/${contentUuid}/fetchComments`);
      const commentsArray = res.data.comments || [];
      set_fetched_Comments_In_Context_State(commentsArray, contentUuid);
    } catch (err) {
      console.error("Fetch failed:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contentUuid) {
      loadComment();
    }
  }, [contentUuid]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const textToSend = commentText;
    setCommentText("");
    const loggedInUserPost = tasks.find((t) => t.user_id === currentUserId);
    const realAuthorName = loggedInUserPost
      ? loggedInUserPost.author_name
      : "You";

    const optimisticComment = {
      uuid: `temp-${Date.now()}`,
      comment_text: textToSend,
      author_name: realAuthorName,
      created_at: new Date().toISOString(),
    };

    update_Created_Comment_In_Context_State(optimisticComment, contentUuid);

    try {
      await api.post(`/task/${contentUuid}/comments`, {
        comment_text: textToSend,
      });

      const freshRes = await api.get(`task/${contentUuid}/fetchComments`);
      set_fetched_Comments_In_Context_State(
        freshRes.data.comments || [],
        contentUuid,
      );
    } catch (err) {
      console.error("Save failed, reverting changes...", err.message);
      alert("Could not sync comment. Reloading list.");
      loadComment();
    }
  };

  return (
    <div
      style={{
        background: "#1e2030",
        padding: "15px",
        borderRadius: "8px",
        marginTop: "10px",
        border: "1px solid #3b4261",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{ color: "#ffffff", margin: "0 0 10px 0", fontSize: "16px" }}
        >
          Comments ({thisPostComments.length})
        </h3>
        {isLoading && (
          <span style={{ color: "#7aa2f7", fontSize: "12px" }}>Syncing...</span>
        )}
      </div>

      <button
        onClick={onClose}
        style={{
          color: "#ff757f",
          cursor: "pointer",
          background: "none",
          border: "none",
          marginBottom: "10px",
        }}
      >
        Close Drawer
      </button>

      {/* 📜 Scrollable List Box */}
      <div
        className="comments-list-box"
        style={{
          minHeight: "50px",
          maxHeight: "200px",
          overflowY: "auto",
          marginBottom: "15px",
        }}
      >
        {thisPostComments.length === 0 && isLoading ? (
          <p style={{ color: "#7aa2f7" }}>Loading thoughts...</p>
        ) : thisPostComments.length === 0 ? (
          <p style={{ color: "#a9b1d6" }}>
            No thoughts recorded yet. Be the first to reply!
          </p>
        ) : (
          thisPostComments.map((comment) => (
            <div
              key={comment.uuid || comment.id}
              style={{
                padding: "8px",
                marginBottom: "8px",
                background: "#1a1b26",
                borderRadius: "6px",
              }}
            >
              <strong
                style={{ fontSize: "13px", display: "block", color: "#7aa2f7" }}
              >
                {comment.author_name || "Anonymous"}
              </strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              >
                {comment.comment_text}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="write a reply..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            background: "#1a1b26",
            color: "#ffffff",
            border: "1px solid #414868",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 12px",
            background: "#7aa2f7",
            color: "#1a1b26",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          send
        </button>
      </form>
    </div>
  );
};

export default CommentDrawer;
