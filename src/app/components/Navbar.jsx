import React from 'react';
// import logoImage from '../assets/logo.png';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      {/* Left side: Logo */}
      <div className="text-2xl font-bold">
        <Link href="/">OptiRoute</Link>
      </div>

      {/* Right side: Navigation and Login Button */}
      <div className="flex items-center gap-x-8">
        <Link href="/about" className="hover:text-gray-300">About Us</Link>
        <Link href="/partner" className="hover:text-gray-300">Become a Partner</Link>
        <Link href="/user/Register" className="hover:text-gray-300">Register</Link>
        
        {/* The Login button now routes to your new /user/Login page */}
        <Link href="/user/Login">
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}