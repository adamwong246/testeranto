/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";
export const WebSocketContext = createContext({
    ws: null,
    isConnected: false,
    sendMessage: function (message) {
        throw new Error("Function not implemented.");
    },
});
export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
