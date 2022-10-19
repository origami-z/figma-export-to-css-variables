import { ToolkitProvider } from "@jpmorganchase/uitk-core";
import React, { useEffect, useState } from "react";
import {
  PluginCommandType,
  PostToFigmaMessage,
  PostToUIMessage,
} from "../shared-src";
import { CornerResizer } from "./components/CornerResizer";
import { ExportCssView } from "./views/ExportCssView";
import { ExportJsonView } from "./views/ExportJsonView";

import "./App.css";
import "./Icon.css"; // icon bug from uitk-icons@0.2.0 & 0.3.0

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [launchCommand, setLaunchCommand] =
    useState<PluginCommandType>("export-css-var");

  useEffect(() => {
    // Support Figma dark theme - https://www.figma.com/plugin-docs/css-variables/
    if (document.querySelector("html")?.classList.contains("figma-dark")) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "ui-ready",
        } as PostToFigmaMessage,
      },
      "*"
    );
  }, []);

  const handleMessage = (event: MessageEvent) => {
    const msg = event.data.pluginMessage as PostToUIMessage;
    switch (msg.type) {
      case "launch-view":
        setLaunchCommand(msg.command);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <ToolkitProvider theme={theme} applyClassesToChild>
      <div className="appRoot">
        {launchCommand === "export-css-var" && <ExportCssView />}
        {launchCommand === "export-json" && <ExportJsonView />}
        <CornerResizer />
      </div>
    </ToolkitProvider>
  );
}

export default App;
