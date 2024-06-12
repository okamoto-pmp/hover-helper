import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.createElement("div");
root.id = "crx-root";
root.classList.add("hover-helper");
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
