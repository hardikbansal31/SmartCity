// FILE: src/app/layout.js
// This is the updated root layout to make the Navbar sticky.

import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Smart City",
  description: "Made by Quadrant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    
      <body className="h-screen flex flex-col">
        
        
        <header>
          <Navbar/>
        </header>

        
        <main className="flex-grow relative overflow-y-hidden">
          {children}
        </main>
        
      </body>
    </html>
  );
}