// "use client"
// import { useEffect } from "react";

// export default function useTrafficSocket(onData) {
//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:4000");

//     socket.onopen = () => {
//       console.log("Connected to WebSocket server");
//     };

//     socket.onmessage = (event) => {
//   try {
//     const data = JSON.parse(event.data);
//     if (data.type === "connected") {
//       console.log("✅ Server acknowledged connection");
//     } else {
//       onData(data); // Treat as sensor update
//     }
//   } catch (err) {
//     console.error("Invalid WebSocket message:", err);
//   }
// };

//     socket.onclose = () => {
//       console.log("❌ WebSocket connection closed");
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     return () => {
//       socket.close(); // Cleanup on unmount
//     };
//   }, [onData]);
// }

"use client";
import { useEffect } from "react";

export default function useTrafficSocket(onData) {
  useEffect(() => {
    // Only try to connect if in the 'development' environment
    if (process.env.NODE_ENV === "development") {
      const socket = new WebSocket("ws://localhost:4000");

      socket.onopen = () => {
        console.log("✅ Connected to WebSocket server (DEV ONLY)");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "connected") {
            console.log("Server acknowledged connection");
          } else {
            onData(data); // Treat as sensor update
          }
        } catch (err) {
          console.error("Invalid WebSocket message:", err);
        }
      };

      socket.onclose = () => {
        console.log("❌ WebSocket connection closed (DEV ONLY)");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error (DEV ONLY):", error);
      };

      // The cleanup function is also inside the conditional block
      return () => {
        socket.close();
      };
    }
  }, [onData]);
}
