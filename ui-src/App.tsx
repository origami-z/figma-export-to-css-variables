import {
  Button,
  Checkbox,
  FlexLayout,
  FormField,
  Input,
  ToolkitProvider,
  StackLayout,
} from "@jpmorganchase/uitk-core";
import { Dropdown } from "@jpmorganchase/uitk-lab";
import React, { useEffect, useRef, useState } from "react";
import {
  ExportColorAllFormats,
  ExportColorFormat,
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
  const [ignoreFirstGroup, setIgnoreFirstGroup] = useState(false);
  const [ignoreDefaultEnding, setIgnoreDefaultEnding] = useState(false);

  const onExport = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "export-css",
          prefix,
          format,
          ignoreFirstGroup,
          ignoreDefaultEnding,
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
        setText(pluginMessage.data.join("\n"));
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
      <StackLayout gap={1}>
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
        <FlexLayout>
          <Checkbox
            label="Extract by first group"
            checked={ignoreFirstGroup}
            onChange={(_, checked) => setIgnoreFirstGroup(checked)}
          />
          <Checkbox
            label="Trim default ending"
            checked={ignoreDefaultEnding}
            onChange={(_, checked) => setIgnoreDefaultEnding(checked)}
          />
        </FlexLayout>
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
      </StackLayout>
    </ToolkitProvider>
  );
}

export default App;
