// utils/chat.ts
import type { ChatMessageProps } from "../../types";

export function prepareMessagesForVirtuoso(messages: ChatMessageProps[]): ChatMessageProps[] {
  // Clone + reverse so newest messages appear at the bottom
  return [...messages].reverse();
}
