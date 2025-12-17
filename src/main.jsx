// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { PortfolioProvider } from "./context/PortfolioContext";
import { PremiumProvider } from "./context/PremiumContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PortfolioProvider>
        <PremiumProvider>
          <App />
        </PremiumProvider>
      </PortfolioProvider>
    </BrowserRouter>
  </React.StrictMode>
);
