interface WebSocketContextType {
    ws: WebSocket | null;
    isConnected: boolean;
    sendMessage: (message: any) => void;
}
interface TutorialModeContextType {
    tutorialMode: boolean;
    setTutorialMode: (mode: boolean) => void;
}
interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: () => void;
    logout: () => void;
}
export declare const useWebSocket: () => WebSocketContextType;
export declare const useTutorialMode: () => TutorialModeContextType;
export declare const useAuth: () => AuthContextType;
export declare const App: () => JSX.Element;
export {};
