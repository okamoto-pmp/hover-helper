import "./App.css";
import { useEffect, useState } from "react";
import { Message, GPTResponse } from "../types";
import { AssistTextDialog } from "./components/AssistTextDialog";

function App() {
  const [hoveredPTag, setHoveredPTag] = useState<HTMLElement | null>(null);
  const [dialogPosition, setDialogPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [gptResponse, setGptResponse] = useState<GPTResponse>([]);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleEnqueue = async () => {
    chrome.runtime.sendMessage({
      action: "enqueue",
    });
  };

  useEffect(() => {
    if (!loading) handleEnqueue();
    setLoading(false);

    const listener = (request: Message) => {
      console.log(request);

      if (request.action === "queueCompleted") {
        setGptResponse(request.resultJSON);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [loading]);

  useEffect(() => {
    addListenerToKeyword(gptResponse);
  }, [gptResponse]);

  const addListenerToKeyword = (response) => {
    const keywords = response.map((item) => item.keyword);
    const elements = document.querySelectorAll(".crayons-article__main p");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      let text = element.textContent || "";
      keywords.forEach((keyword) => {
        if (text.includes(keyword)) {
          text = text.replace(
            keyword,
            `<span class="keyword" style="color: red;">${keyword}</span>`
          );
        }
      });

      if (text !== element.textContent) {
        const newElement = document.createElement("span");
        newElement.innerHTML = text;
        element.parentNode?.replaceChild(newElement, element);
      }
    }

    const spanTags = document.querySelectorAll("span.keyword");
    spanTags.forEach((spanTag) => {
      spanTag.addEventListener("mouseenter", handleMouseEnter);
      spanTag.addEventListener("mouseleave", handleMouseLeave);
    });
  };

  const handleMouseEnter = (event: MouseEvent) => {
    const hoveredSpan = event.currentTarget as HTMLElement;
    const hoveredText = hoveredSpan.textContent || "";

    const matchedResponse = gptResponse.find(
      (response) => response.keyword === hoveredText
    );

    if (matchedResponse) {
      setHoveredPTag(hoveredSpan);
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      setDialogPosition({
        x: event.clientX + scrollX,
        y: event.clientY + scrollY,
      });

      setDialogMessage(matchedResponse.summary);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPTag(null);
  };

  return (
    <>
      {hoveredPTag && (
        <AssistTextDialog message={dialogMessage} position={dialogPosition} />
      )}
    </>
  );
}

export default App;
