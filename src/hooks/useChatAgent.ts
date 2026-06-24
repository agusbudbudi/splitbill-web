"use client";

import { useCallback } from "react";
import {
  useSplitBillChatStore,
  type ChatMessage,
} from "@/store/useSplitBillChatStore";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * useChatAgent
 *
 * Wraps the chat store's addMessage + setIsTyping into an async helper that
 * simulates the agent "typing" before each response burst.
 */
export function useChatAgent() {
  const { setIsTyping, addMessage } = useSplitBillChatStore();

  /**
   * Show typing indicator for `typingDelay` ms, then add messages one by one
   * with a short gap between them for a natural feel.
   */
  const sendAgentMessages = useCallback(
    async (
      messages: Omit<ChatMessage, "id" | "timestamp">[],
      typingDelay = 750
    ) => {
      setIsTyping(true);
      await sleep(typingDelay);
      setIsTyping(false);

      for (let i = 0; i < messages.length; i++) {
        addMessage(messages[i]);
        if (i < messages.length - 1) {
          await sleep(380);
        }
      }
    },
    [setIsTyping, addMessage]
  );

  return { sendAgentMessages };
}
