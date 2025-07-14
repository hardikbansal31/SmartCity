import { useEffect } from "react";

export default function useTrafficSocket(onData) {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onData(data); // push to state in component
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close(); // Cleanup on unmount
    };
  }, [onData]);
}
