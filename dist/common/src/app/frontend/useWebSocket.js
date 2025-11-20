"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebSocket = exports.WebSocketContext = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = require("react");
exports.WebSocketContext = (0, react_1.createContext)({
    ws: null,
    isConnected: false,
    sendMessage: function (message) {
        throw new Error("Function not implemented.");
    },
});
const useWebSocket = () => {
    return (0, react_1.useContext)(exports.WebSocketContext);
};
exports.useWebSocket = useWebSocket;
