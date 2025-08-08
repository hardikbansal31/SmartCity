"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `https://ieee-hazard-analyzer-latest.onrender.com/login/${username.trim()}/${password.trim()}`,
        { method: "GET" }
      );

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      console.log("Login Response:", data);

      if (data.message === "User exists") {
      alert("Login successful!");
      localStorage.setItem("user", JSON.stringify(data.user));

      // Trigger an event so Navbar updates
      window.dispatchEvent(new Event("storage"));

      router.push("/user/dashboard");
      }

     
      else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Error logging in");
    }
  };

  return (
    <div className="min-h-screen bg-black z-20 flex items-center justify-center text-white">
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
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

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          New User?{" "}
          <Link
            href="/user/Register"
            className="font-medium text-orange-500 hover:text-orange-400"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
