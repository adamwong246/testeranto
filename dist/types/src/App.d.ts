interface WebSocketContextType {
    ws: WebSocket | null;
    isConnected: boolean;
}
interface TutorialModeContextType {
    tutorialMode: boolean;
    setTutorialMode: (mode: boolean) => void;
}
export declare const useWebSocket: () => WebSocketContextType;
export declare const useTutorialMode: () => TutorialModeContextType;
export declare const App: () => JSX.Element;
export {};
