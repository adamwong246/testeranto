/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";

interface WebSocketContextType {
  ws: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  ws: null,
  isConnected: false,
  sendMessage: function (message: any): void {
    throw new Error("Function not implemented.");
  },
});

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
