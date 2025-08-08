"use client"
import React from 'react'
import TrafficFeed from '../../components/User/TrafficFeed'

function page() {
  return (
    <div className="flex z-[0] absolute top-4 right-0 ml-[16.5vw] justify-center h-[90vh] w-[83.5vw] items-center relative">
      <TrafficFeed />
    </div>
  )
}

export default page
