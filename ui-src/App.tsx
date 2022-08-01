import { ToolkitProvider } from "@jpmorganchase/uitk-core";
import React, { useState, useEffect } from "react";
import { ExportCssView } from "./views/ExportCssView";

import "./App.css";
import "./Icon.css"; // icon bug from uitk-icons@0.2.0 & 0.3.0

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Support Figma dark theme - https://www.figma.com/plugin-docs/css-variables/
    if (document.querySelector("html")?.classList.contains("figma-dark")) {
      setTheme("dark");
    }
  }, []);

  return (
    <ToolkitProvider theme={theme}>
      <ExportCssView />
    </ToolkitProvider>
  );
}

export default App;
