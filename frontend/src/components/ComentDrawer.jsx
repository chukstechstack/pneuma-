import React, { useState, useContext } from "react";
import api from "../api/axios.js";
// 🎯 FIXED: Removed the curly braces around TaskContext to match your default export style!
import TaskContext from "../context/TaskContext.jsx";
// 🎯 FIXED: Wrapped TaskContext in curly braces if it's a named export

const CommentDrawer = ({ contentUuid, onClose }) => {
  // 🎯 FIXED: Changed from array brackets [] to object braces {} to match your Provider value template
  const { comments, update_Created_Comment_In_Context_State } =
    useContext(TaskContext);

  // 🎯 FIXED: Initialized with an empty string "" to prevent uncontrolled input crashes
  const [commentText, setCommentText] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const textToSend = commentText;
    setCommentText("");

    try {
      const res = await api.post(`/task/${contentUuid}/comments`, {
        comment_text: textToSend,
      });

      console.log("save successfuly", res.data);
      update_Created_Comment_In_Context_State(res.data, contentUuid);
    } catch (err) {
      console.error(err.message);
      setCommentText(textToSend);
      alert("could not send comment. Please check your connection");
    }
  };

  return (
    <div
      style={{
        background: "#1e2030", // Forces a clear dark background container
        padding: "15px",
        borderRadius: "8px",
        marginTop: "10px",
        border: "1px solid #3b4261",
      }}
    >
      <h3 style={{ color: "#ffffff", margin: "0 0 10px 0", fontSize: "16px" }}>
        Comments
      </h3>
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

      {/* 📜 Scrollable List Box with clear color variables */}
      <div
        className="comments-list-box"
        style={{
          minHeight: "50px",
          maxHeight: "200px",
          overflowY: "auto",
          marginBottom: "15px",
        }}
      >
        {comments.length === 0 ? (
          <p style={{ color: "#a9b1d6" }}>
            No thoughts recorded yet. Be the first to reply!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.uuid || comment.id}
              style={{
                padding: "8px",
                marginBottom: "8px",
                background: "#1a1b26",
                borderRadius: "6px",
              }}
            >
              {/* 🎯 FORCED BRIGHT BLUE FOR AUTHOR */}
              <strong
                style={{ fontSize: "13px", display: "block", color: "#7aa2f7" }}
              >
                {comment.author_name || "Anonymous"}
              </strong>
              {/* 🎯 FORCED PURE WHITE FOR TEXT STRING */}
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
