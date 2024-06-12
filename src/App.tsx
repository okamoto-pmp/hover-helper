import "./App.css";
import { useEffect, useState } from "react";
import { Message } from "../types";
import { AssistTextDialog } from "./components/AssistTextDialog";

function App() {
  const [hoveredPTag, setHoveredPTag] = useState<HTMLElement | null>(null);
  const [dialogPosition, setDialogPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const handleEnqueue = async () => {
    chrome.runtime.sendMessage({
      action: "enqueue",
    });
  };

  useEffect(() => {
    const listener = (request: Message) => {
      if (request.action === "queueCompleted") {
        addListenerToKeyword();
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const addListenerToKeyword = () => {
    const spanTags = document.querySelectorAll("span");
    spanTags.forEach((spanTag) => {
      spanTag.addEventListener("mouseenter", handleMouseEnter);
      spanTag.addEventListener("mouseleave", handleMouseLeave);
    });
  };

  const handleMouseEnter = (event: MouseEvent) => {
    setHoveredPTag(event.currentTarget as HTMLElement);
    setDialogPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredPTag(null);
  };

  return (
    <>
      <div>
        <p>
          <span>Hello world!</span>
        </p>
        <button type="button" onClick={handleEnqueue}>Enqueue</button>
      </div>
      {hoveredPTag && (
        <AssistTextDialog
          message="This is a dialog"
          position={dialogPosition}
        />
      )}
    </>
  );
}

export default App;
