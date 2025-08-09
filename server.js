import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4000 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    // When device.js sends data, broadcast to all clients
    console.log("Received:", message.toString());
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:4000");
