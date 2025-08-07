import Analytics from "@/app/components/User/Analytics";

import React from 'react'

export default function page() {
  return (
    <>
        <div className="flex w-screen relative bg-black">
              <div className="flex-1 absolute top-0 right-0 ">
                <Analytics />
              </div>
            </div>
    </>
  )
}
