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
      <div className="hover-helper">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <button
          onClick={handleEnqueue}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Enqueue
        </button>
      </div>
    </>
  );
}

export default App;
