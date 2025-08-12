import Reports from "@/app/components/User/ReportsPage";

import React from "react";

export default function page() {
  return (
    <>
      <div className="flex z-[0] absolute top-0 right-0 ml-[16.5vw] justify-center h-[90vh] w-[83.5vw] items-center relative">
        <Reports />
      </div>
    </>
  );
}
