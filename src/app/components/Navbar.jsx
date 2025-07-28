import React from 'react';
// import logoImage from '../assets/logo.png';

const Navbar = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
           {/* <img src={logoImage} alt="OptiRoute Logo" className="h-8 w-8" /> */}
           <span className="text-2xl font-bold text-white">OptiRoute</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-white">
          <a href="#" className="hover:text-orange-400 transition-colors duration-300">
            About Us
          </a>
          <a href="#" className="hover:text-orange-400 transition-colors duration-300">
            Become a Partner
          </a>
          <a href="#" className="hover:text-orange-400 transition-colors duration-300 font-semibold">
            Register
          </a>
        </nav>

        {/* Login Button */}
        <a
          href="#"
          className="hidden md:inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
        >
          Login
        </a>
        
        {/* Mobile Menu Button (Hamburger Icon) */}
        <div className="md:hidden">
            <button className="text-white focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;