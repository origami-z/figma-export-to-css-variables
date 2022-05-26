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
    <main>
      <button onClick={onExport}>Export</button>
      <textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        ref={textareaRef}
      ></textarea>
      <button onClick={onCopy} ref={copyButtonRef}>
        Copy
      </button>
    </main>
  );
}

export default App;
