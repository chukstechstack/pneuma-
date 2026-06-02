import React from "react";

const ServerError = ({ message }) => {
  // If there is no error message passed in, render absolutely nothing
  if (!message) return null;

  return (
    <div 
      className="server-error-banner" 
      style={{
        backgroundColor: "rgba(234, 67, 53, 0.1)",
        border: "1px solid #ea4335",
        color: "#ea4335",
        padding: "0.75rem 1rem",
        borderRadius: "6px",
        fontSize: "0.85rem",
        marginBottom: "1.5rem",
        textAlign: "center"
      }}
    >
      {message}
    </div>
  );
};

export default ServerError;
