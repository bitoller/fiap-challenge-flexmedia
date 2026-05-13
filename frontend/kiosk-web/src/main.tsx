import React from "react";
import { createRoot } from "react-dom/client";
import "./shared/styles/variables.css";
import "./shared/styles/layout.css";
import "./presentation/features/checkin-flow/checkinFlow.css";
import "./shared/styles/bootstrap.scss";
import { Providers } from "./core/providers";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
