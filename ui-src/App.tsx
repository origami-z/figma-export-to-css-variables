import { Button, ToolkitProvider } from "@jpmorganchase/uitk-core";
import { FlexLayout } from "@jpmorganchase/uitk-lab";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const [text, setText] = useState("");

  const onExport = () => {
    parent.postMessage({ pluginMessage: { type: "export-css" } }, "*");
  };

  const onCopy = () => {
    textareaRef.current?.select();
    document.execCommand("copy");
    copyButtonRef.current?.focus();
  };

  const handleMessage = (event: MessageEvent) => {
    switch (event.data.pluginMessage.type) {
      case "generated":
        setText(
          (event.data.pluginMessage.data.outputText as string[]).join("\n")
        );
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
    <ToolkitProvider>
      <FlexLayout direction="column" align="center">
        <Button onClick={onExport}>Export</Button>
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          ref={textareaRef}
          spellCheck={false}
        ></textarea>
        <Button onClick={onCopy} ref={copyButtonRef}>
          Copy
        </Button>
      </FlexLayout>
    </ToolkitProvider>
  );
}

export default App;
