import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatMessageProps } from "../../types";

interface ChatState {
  socket: WebSocket | null;
  isConnected: boolean;
  messages: ChatMessageProps[];
  newMessages:ChatMessageProps[],
}

const initialState: ChatState = {
  socket: null,
  isConnected: false,
  messages: [],
  newMessages:[],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    connectSocket: (state, action: PayloadAction<string>) => {
      const url = action.payload;

      // Close any existing connection
      if (state.socket) {
        state.socket.close();
      }

      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log("✅ WebSocket connected");
        state.isConnected = true;
      };

      socket.onclose = () => {
        console.log("❌ WebSocket disconnected");
        state.isConnected = false;
      };

      socket.onerror = (err) => {
        console.error("⚠️ WebSocket error:", err);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 Message received:", data);
          // you can't directly mutate here; will dispatch in middleware or thunk
        } catch {
          console.error("Failed to parse message");
        }
      };

      state.socket = socket;
    },

    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.close();
        state.socket = null;
        state.isConnected = false;
      }
    },

    sendMessage: (state, action: PayloadAction<any>) => {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        state.socket.send(JSON.stringify(action.payload));
      }
    },

    addMessage: (state, action: PayloadAction<any>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { connectSocket, disconnectSocket, sendMessage, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
