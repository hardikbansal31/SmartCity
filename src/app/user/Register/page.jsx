"use client";

import React from 'react';
// import googleLogo from '../assets/Google.png';
import Link from 'next/link';

const Register = () => {
  return (
    // Main container to center the form on the page
    <div className="min-h-screen flex items-center justify-center text-white">
      {/* Form container with dark background and styling */}
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
        
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

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
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

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Google Sign-in Button */}
        <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-300">
          {/* The SVG has been replaced with an img tag */}
          {/* <img src={googleLogo} alt="Google sign-in" className="w-5 h-5 mr-2" /> */}
          Sign in with Google
        </button>

        {/* Link to Login */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/user/Login" className="font-medium text-orange-500 hover:text-orange-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;