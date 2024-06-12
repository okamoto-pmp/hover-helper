import "./App.css";
import { useEffect } from "react";
import { Message } from "../types";

function App() {
  const handleEnqueue = async () => {
    chrome.runtime.sendMessage({
      action: "enqueue",
    });
  };

  useEffect(() => {
    const listener = (request: Message) => {
      if (request.action === "queueCompleted") {
        const pTags = document.querySelectorAll("p");
        pTags.forEach((pTag) => {
          pTag.style.color = "red";
        });
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  return (
    <>
      <div>
        <h1>Hello world!</h1>
        <button onClick={handleEnqueue}>Enqueue</button>
      </div>
    </>
  );
}

export default App;
