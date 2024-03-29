/** @jsx jsx */
import { jsx } from "@emotion/core";
import { css } from "@emotion/core";

import { styleObject, cssObject } from "../Constants/constants";
import React, { useState, useCallback, useEffect } from "react";
import {
  FrameActions,
  FrameConnector,
  HostActionsHandler,
} from "@govtechsg/decentralized-renderer-react-components";

interface AppProps {
  document: {
    name: string;
    document: any;
  };
}

export const Viewer: React.FunctionComponent<AppProps> = ({
  document,
}): React.ReactElement => {
  const [toFrame, setToFrame] = useState<HostActionsHandler>();
  const [height, setHeight] = useState(50);
  const [templates, setTemplates] = useState<{ id: string; label: string }[]>(
    []
  );
  const [certificate, setCertificate] = useState<{
    name: string;
    document: any;
  }>();

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const fn = useCallback((toFrame: HostActionsHandler) => {
    setToFrame(() => toFrame);
  }, []);

  const fromFrame = (action: FrameActions): void => {
    if (action.type === "UPDATE_HEIGHT") {
      setHeight(action.payload);
    }
    if (action.type === "UPDATE_TEMPLATES") {
      setTemplates(action.payload);
      setSelectedTemplate(action.payload[0].id);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.renderDocument = (document) => {
    if (toFrame && document) {
      toFrame({
        type: "RENDER_DOCUMENT",
        payload: {
          document,
        },
      });
    }
  };

  useEffect(() => {
    if (document == null) return;
    if (document !== null) {
      setCertificate(document);
    }
  }, []);

  useEffect(() => {
    if (document == null) return;
    if (toFrame && document) {
      toFrame({
        type: "RENDER_DOCUMENT",
        payload: {
          document: document.document,
        },
      });
    }
  }, [toFrame, document]);

  useEffect(() => {
    if (document == null) return;
    if (toFrame && selectedTemplate) {
      toFrame({
        type: "SELECT_TEMPLATE",
        payload: selectedTemplate,
      });
    }
  }, [selectedTemplate, toFrame]);

  return (
    <div 
          css={css`
            width: 80%;
          `}
        >
      <styleObject.FrameContainer>
        <div
          css={css`
            width: 90%;
            display: ${document ? "block" : "none"};
          `}
        >
          <styleObject.TemplatesContainer>
            <ul css={cssObject.thirdStyle}>
              {templates.map((template) => (
                <li
                  key={template.id}
                  className={`tab ${
                    selectedTemplate === template.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                  }}
                >
                  <a href="#">{template.label}</a>
                </li>
              ))}
            </ul>
          </styleObject.TemplatesContainer>
          <div css={cssObject.fourthStyle}>
            <FrameConnector
              // Source should link to a working renderer. In this case you
              // could run the other renderer repository on localhost:3000 
              // and have this examples work. If that doesn't work, simply 
              // change it to https://www.renderer.mza.jp/
              source="https://www.renderer.mza.jp" //http://localhost:3000
              dispatch={fromFrame}
              onConnected={fn}
              css={css`
                max-width: 1120px;
                border: 0;
                width: 100%;
                height: ${height}px;
                padding: 1rem;
                padding-top: 0.5rem;
              `}
            />
          </div>
        </div>
      </styleObject.FrameContainer>
    </div>
  );
};

export default Viewer;
