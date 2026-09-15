"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    difyChatbotConfig?: {
      token: string;
      baseUrl: string;
      inputs: Record<string, string>;
      systemVariables: Record<string, string>;
      userVariables: Record<string, string>;
    };
  }
}

const chatbotScriptId = "z56NlyDZUXEJMINp";

export function DifyChatbot() {
  useEffect(() => {
    window.difyChatbotConfig = {
      token: chatbotScriptId,
      baseUrl: "https://udify.app",
      inputs: {},
      systemVariables: {},
      userVariables: {},
    };

    if (document.getElementById(chatbotScriptId)) return;

    const script = document.createElement("script");
    script.id = chatbotScriptId;
    script.src = "https://udify.app/embed.min.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
