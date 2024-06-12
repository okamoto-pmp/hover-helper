import React from "react";

interface AssistTextDialogProps {
  message: string;
  position: { x: number; y: number };
}

export const AssistTextDialog: React.FC<AssistTextDialogProps> = ({
  message,
  position,
}) => {
  return (
    <div style={{ ...styles.dialog, top: position.y - 50, left: position.x }}>
      {message}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  dialog: {
    position: "absolute",
    width: "200px",
    padding: "10px",
    border: "1px solid #000",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
  },
};
