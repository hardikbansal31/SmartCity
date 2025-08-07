'use client'; // Required for using hooks

import React from "react";
import Link from 'next/link'; // Import Link for client-side navigation
import { usePathname } from 'next/navigation'; // Import usePathname to get current URL

import {
  MapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  SignalIcon,
  WifiIcon
} from '@heroicons/react/24/solid';

// I've added the 'href' property to each item for navigation
const navigationItems = [
  { name: 'Live Map', href: '/admin/dashboard', icon: MapIcon },
  { name: 'Feed Manager', href: '/admin/#', icon: DocumentTextIcon },
  { name: 'Route Manager', href: '/admin/#', icon: MapIcon },
  { name: 'Analytics', href: '/admin/#', icon: ChartBarIcon },
  { name: 'Historical Data', href: '/admin/#', icon: ClockIcon },
  { name: 'Alerts', href: '/admin/#', icon: ExclamationTriangleIcon },
  { name: 'Signal Controller', href: '/admin/#', icon: SignalIcon},
  { name: 'User Broadcast', href: '/admin/#', icon: WifiIcon},
  { name: 'Setting', href: '/admin/#', icon: Cog6ToothIcon },
];

function SidePanel() {
  const pathname = usePathname(); // Get the current path

  return (
    // Using fixed width and full height for persistence
    <div className='sidepanel w-64 h-screen bg-[#1B1B1B] flex flex-col p-6 space-y-8 fixed'>
      

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        {navigationItems.map((item) => {
          // Check if the current link is active
          const isActive = pathname === item.href;
          const Icon = item.icon; // Use a capitalized variable for the component

          return (
            <Link // Use the Link component here
              key={item.name}
              href={item.href}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? 'bg-orange-600 text-white' // Active link style
                    : 'text-zinc-400 hover:bg-orange-600 hover:text-white' // Inactive link style
                }
              `}
            >
              <Icon className="h-6 w-6 mr-4" />
              <span className="font-semibold text-lg">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default SidePanel;
