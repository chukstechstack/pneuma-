import React from "react";
const DevBanner = () => {
  const currentFocus =
    "Working on shares and Likes Functionality";

  return (
    <div
      style={{
        position: "fixed", // Fix to top
        top: "60px",
        left: 0,
        width: "100%",
        zIndex: "2000", // Must be higher than your nav (1000)
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "35px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff3cd",
          color: "#856404",
          padding: "8px 20px",
          width: "100%",
          textAlign: "center",
          fontSize: "15px", // Slightly smaller for mobile
          fontWeight: "600",
          borderBottom: "1px solid #ffeeba",
          boxSizing: "border-box",
        }}
      >
        🚧 Under Development: working on{" "}
        <span style={{ textDecoration: "underline" }}>{currentFocus}</span>
      </div>
    </div>
  );
};

export default DevBanner;
