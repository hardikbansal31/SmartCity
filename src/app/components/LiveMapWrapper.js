"use client";

import dynamic from "next/dynamic";

// Dynamically import the map with SSR disabled (only on client)
const LiveMap = dynamic(() => import("./LiveMap"), { ssr: false });

export default function LiveMapWrapper() {
  return <LiveMap />;
}
