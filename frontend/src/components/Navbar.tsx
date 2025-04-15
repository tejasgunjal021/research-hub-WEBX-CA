import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-950 text-white shadow-lg py-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        
        {/* Logo Section (Left) */}
        <div className="text-2xl font-bold text-green-400 flex-1 whitespace-nowrap">
          <Link to="/">Research Hub</Link>
        </div>

        {/* Navigation Links (Centered) */}
        <div className="flex-1 flex justify-center gap-6 text-gray-300 flex-nowrap">
          <Link to="/" className="hover:text-green-400 transition duration-300 whitespace-nowrap">Home</Link>
          <Link to="/research-papers" className="hover:text-green-400 transition duration-300 whitespace-nowrap">Research Papers</Link>
          <Link to="/datasets" className="hover:text-green-400 transition duration-300 whitespace-nowrap">Datasets</Link>
          <Link to="/trending" className="hover:text-green-400 transition duration-300 whitespace-nowrap">Trending</Link>
          {/* <Link to="/saved" className="hover:text-green-400 transition duration-300 whitespace-nowrap">Saved Discussions</Link> */}
          <Link to="/discussions" className="hover:text-green-400 transition duration-300 whitespace-nowrap">Discussions</Link>
          
          <Link to="/signup" className="hover:text-green-400 transition duration-300 whitespace-nowrap">Sign Up</Link>
          <Link to="/login" className="hover:text-green-400 transition duration-300 whitespace-nowrap">Login</Link>
        </div>

        {/* Call to Action Button (Right) */}
        <div className="flex-1 flex justify-end">
          <Link to="/start" className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 whitespace-nowrap">
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
