// websocket-server.js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4000 });

console.log("✅ WebSocket server started on ws://localhost:4000");

wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("📦 Traffic Update Received:", data);

      // Broadcast to all other clients (like the React app)
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (err) {
      console.error("❌ Error parsing message:", err);
    }
  });

  ws.on("close", () => {
    console.log("🚫 Client disconnected");
  });
});
