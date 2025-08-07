
"use client";

import React from 'react';
import LiveMapWrapper2 from '../../components/User/LiveMapWrapper2'; // Make sure this path is correct

export default function DashboardPage() {
  return (
    
    <div className="flex w-screen relative bg-black">
      <div className="flex-1 absolute top-0 right-0 ">
        <LiveMapWrapper2 />
      </div>
    </div>
  );
}
