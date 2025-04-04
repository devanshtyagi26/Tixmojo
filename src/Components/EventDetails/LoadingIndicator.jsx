import React from 'react';

const LoadingIndicator = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <div
        style={{
          color: "var(--primary)",
          fontSize: "18px",
          fontWeight: "500",
        }}
      >
        Loading event details...
      </div>
    </div>
  );
};

export default LoadingIndicator;