// socket-server.js
import http from 'http';
import { WebSocketServer } from 'ws';

const server = http.createServer(); // Empty HTTP server to bind WebSocket to
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  // ✅ Send initial welcome message to this specific client
  ws.send(JSON.stringify({ type: "connected", message: "WebSocket connection established" }));

  // ✅ Handle message from this client
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("📦 Traffic Update Received:", data);

      // ✅ Broadcast to all connected clients (including frontend)
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
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

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);
});
