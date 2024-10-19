import http from "http";

export default async (
  port: string
): Promise<{ webSocketDebuggerUrl: string }> =>
  new Promise((resolve, reject) => {
    let json = "";
    const request = http.request(
      {
        host: "127.0.0.1",
        path: "/json/version",
        port,
      },
      (response) => {
        response.on("error", reject);
        response.on("data", (chunk: Buffer) => {
          json += chunk.toString();
        });
        response.on("end", () => {
          resolve(JSON.parse(json));
        });
      }
    );
    request.on("error", reject);
    request.end();
  });
