import { Button, FormField, StackLayout } from "@jpmorganchase/uitk-core";
import { Dropdown } from "@jpmorganchase/uitk-lab";
import React, { useEffect, useRef, useState } from "react";
import {
  ExportColorAllFormats,
  ExportColorFormat,
  PostToFigmaMessage,
  PostToUIMessage,
} from "../../shared-src";

export const ExportJsonView = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const [text, setText] = useState("");
  const [format, setFormat] = useState<ExportColorFormat>(
    ExportColorAllFormats[0]
  );

  const onExport = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "export-json",
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
        setText(pluginMessage.data);
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
    <StackLayout gap={1}>
      <FormField label="Format" labelPlacement="left">
        <Dropdown
          source={ExportColorAllFormats}
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
    </StackLayout>
  );
};
