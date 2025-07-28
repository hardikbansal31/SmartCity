"use client";

import React from 'react';

const Login = () => {
  return (
    // Main container to center the form on the page
    <div className="min-h-screen flex items-center justify-center text-white">
      {/* Form container with dark background and styling */}
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
        
        <form className="space-y-6">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;