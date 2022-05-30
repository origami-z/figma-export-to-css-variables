import { Button, ToolkitProvider } from "@jpmorganchase/uitk-core";
import {
  Dropdown,
  FlexLayout,
  FormField,
  Input,
} from "@jpmorganchase/uitk-lab";
import React, { useEffect, useRef, useState } from "react";
import {
  ExportColorFormat,
  ExportColorAllFormats,
  PostToFigmaMessage,
  PostToUIMessage,
} from "../shared-src";
import "./App.css";

function App() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const [text, setText] = useState("");
  const [prefix, setPrefix] = useState("");
  const [format, setFormat] = useState<ExportColorFormat>(
    ExportColorAllFormats[0]
  );

  const onExport = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "export-css",
          prefix,
          format,
        } as PostToFigmaMessage,
      },
      "*"
    );
  };

  const onCopy = () => {
    textareaRef.current?.select();
    document.execCommand("copy");
    copyButtonRef.current?.focus();
  };

  const handleMessage = (event: MessageEvent) => {
    const pluginMessage = event.data.pluginMessage as PostToUIMessage;
    switch (pluginMessage.type) {
      case "generated":
        setText((pluginMessage.data as string[]).join("\n"));
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
      <FlexLayout direction="column">
        <FormField label="Prefix" labelPlacement="left">
          <Input
            value={prefix}
            onChange={(e) => setPrefix(e.currentTarget.value)}
          ></Input>
        </FormField>
        <FormField label="Format" labelPlacement="left">
          <Dropdown
            source={ExportColorAllFormats as any}
            selectedItem={format}
            onChange={(_, item) => {
              if (item) {
                setFormat(item);
              }
            }}
          />
        </FormField>
        <Button onClick={onExport}>Export</Button>
        <textarea
          rows={20}
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
