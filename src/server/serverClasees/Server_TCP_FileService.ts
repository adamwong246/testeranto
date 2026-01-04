import fs from "fs";
import { WebSocket } from "ws";
import { WebSocketMessage } from "../../clients/types";
import { IMode } from "../types";
import { getAllFilesRecursively } from "./utils/getAllFilesRecursively";
import { Server_TCP_WebSocketProcess } from "./Server_TCP_WebSocketProcess";

export class Server_TCP_FileService extends Server_TCP_WebSocketProcess {
  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);
  }

  // FileService methods
  writeFile_send(wsm: WebSocketMessage, ws: WebSocket) {
    ws.send(JSON.stringify(["writeFile", wsm.data.path]));
  }

  writeFile_receive(wsm: WebSocketMessage, ws: WebSocket) {
    fs.writeFileSync(wsm.data.path, wsm.data.content);
  }

  readFile_receive(wsm: WebSocketMessage, ws: WebSocket) {
    this.readFile_send(wsm, ws, fs.readFileSync(wsm.data.path).toString());
  }

  readFile_send(wsm: WebSocketMessage, ws: WebSocket, content: string) {
    ws.send(JSON.stringify(["readFile", wsm.data.path, content]));
  }

  createDirectory_receive(wsm: WebSocketMessage, ws: WebSocket) {
    fs.mkdirSync(wsm.data.path);
    this.createDirectory_send(wsm, ws);
  }

  createDirectory_send(wsm: WebSocketMessage, ws: WebSocket) {
    ws.send(JSON.stringify(["createDirectory", wsm.data.path]));
  }

  deleteFile_receive(wsm: WebSocketMessage, ws: WebSocket) {
    fs.unlinkSync(wsm.data.path);
    this.deleteFile_send(wsm, ws);
  }

  deleteFile_send(wsm: WebSocketMessage, ws: WebSocket) {
    ws.send(JSON.stringify(["deleteFile", wsm.data.path]));
  }

  async files_receive(wsm: WebSocketMessage, ws: WebSocket) {
    this.files_send(wsm, ws, await getAllFilesRecursively("."));
  }

  files_send(wsm: WebSocketMessage, ws: WebSocket, files: string[]) {
    ws.send(JSON.stringify(["files", files]));
  }

  projects_receive(wsm: WebSocketMessage, ws: WebSocket) {
    this.projects_send(
      wsm,
      ws,
      JSON.parse(fs.readFileSync("./testeranto/projects.json", "utf-8"))
    );
  }

  projects_send(wsm: WebSocketMessage, ws: WebSocket, projects: object) {
    ws.send(JSON.stringify(["projects", projects]));
  }

  report_receive(wsm: WebSocketMessage, ws: WebSocket) {
    this.report_send(wsm, ws);
  }

  async report_send(wsm: WebSocketMessage, ws: WebSocket) {
    // Implementation remains the same
  }

  async test_receive(wsm: WebSocketMessage, ws: WebSocket) {
    // Implementation remains the same
  }

  test_send(wsm: WebSocketMessage, ws: WebSocket, project: string[]) {
    ws.send(JSON.stringify(["tests", project]));
  }
}
