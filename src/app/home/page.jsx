"use client"
import React from 'react';

const Hero = () => {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center md:text-left">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        
        
        <div className="flex flex-col items-center md:items-start space-y-6 text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-montserrat">
            <span className="text-orange-500">OptiRoute:</span> Smarter Cities. Smoother Commutes.
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-xl font-montserrat font-light italic">
            Experience the power of real-time traffic intelligence. Whether you’re behind the wheel or behind the grid—move better with OptiRoute.
          </p>
          <a
            href="#"
            className="flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white py-4 px-8 rounded-lg text-lg transition-colors duration-300 font-montserrat"
          >
            Get Started
            <svg
              className="w-6 h-6 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>

        {/* Right Column: Image content */}
        <div className="relative h-64 md:h-auto flex justify-center items-center">
            <div className="absolute w-full h-full max-w-md bg-gray-600 bg-opacity-40 rounded-3xl transform -rotate-6 translate-x-4 translate-y-4"></div>
            <div className="relative w-full max-w-md p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl shadow-2xl">
                <img 
                    src={"/assets/map.png"} 
                    alt="Map showing traffic data" 
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
