import { createRoot } from "react-dom/client";
import "./shared/styles/variables.css";
import "./shared/styles/layout.css";
import "./shared/styles/recovery.css";
import "./presentation/features/checkin-flow/checkinFlow.css";
import "./presentation/features/checkout-flow/checkoutFlow.css";
import "./shared/styles/bootstrap.scss";
import { Providers } from "./core/providers";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>
);
