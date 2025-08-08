"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa"; // user icon

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status on mount
    const user = localStorage.getItem("user");
    setLoggedIn(!!user);

    // Listen for changes in login state (cross-tab or same-tab updates)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setLoggedIn(!!updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      {/* Left side: Logo */}
      <div className="text-2xl font-bold">
        <Link href="/">OptiRoute</Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-x-8">
        <Link href="/user/dashboard" className="hover:text-gray-300">
          User Dashboard
        </Link>
        <Link href="/about" className="hover:text-gray-300">
          About Us
        </Link>
        <Link href="/partner" className="hover:text-gray-300">
          Become a Partner
        </Link>
        

        {loggedIn ? (
          // Logged in → show orange circle with user icon
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
            <FaUserCircle size={22} />
          </div>
        ) : (
          // Not logged in → show login button 
          <>
            <Link href="/user/Register" className="hover:text-gray-300">
          Register
          </Link>
          
          <Link href="/user/Login">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          </Link>
          </>
          
        )}
      </div>
    </nav>
  );
}
