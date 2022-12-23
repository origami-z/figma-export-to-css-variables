import { SaltProvider } from "@salt-ds/core";
import React, { useEffect, useState } from "react";
import {
  PluginCommandType,
  PostToFigmaMessage,
  PostToUIMessage,
} from "../shared-src";
import { CornerResizer } from "./components/CornerResizer";
import { ExportCssView } from "./views/ExportCssView";
import { ExportJsonView } from "./views/ExportJsonView";
import { useFigmaPluginTheme } from "./components/hooks";

import "./App.css";

function App() {
  const [theme] = useFigmaPluginTheme();
  const [launchCommand, setLaunchCommand] =
    useState<PluginCommandType>("export-css-var");

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
    <SaltProvider mode={theme} applyClassesTo="child">
      <div className="appRoot">
        {launchCommand === "export-css-var" && <ExportCssView />}
        {launchCommand === "export-json" && <ExportJsonView />}
        <CornerResizer />
      </div>
    </SaltProvider>
  );
}

export default App;
