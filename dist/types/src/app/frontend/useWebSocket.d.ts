interface WebSocketContextType {
    ws: WebSocket | null;
    isConnected: boolean;
    sendMessage: (message: any) => void;
}
export declare const WebSocketContext: import("react").Context<WebSocketContextType>;
export declare const useWebSocket: () => WebSocketContextType;
export {};
