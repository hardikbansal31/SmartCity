"use client";

import dynamic from "next/dynamic";

// Dynamically import the map with SSR disabled (only on client)
const LiveMap2 = dynamic(() => import("./LiveMap2"), { ssr: false });

export default function LiveMapWrapper2() {
  return <LiveMap2 />;
}
