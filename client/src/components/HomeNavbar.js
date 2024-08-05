import React from 'react';
import { Link } from 'react-router-dom';

const HomeNavbar = () => {
  return (
    <nav className="bg-neutral-950 p-5 font-sans flex justify-between items-center">
      <Link className="text-2xl font-bold text-sky-50" to="/">discount.ai</Link>
      <ul className="flex space-x-4">
        <li><Link className="text-blue-300 hover:text-sky-800" to="/">Home</Link></li>
        <li><Link className="text-blue-300 hover:text-sky-800" to="/create">Create</Link></li>
        <li><Link className="text-blue-300 hover:text-sky-800" to="/analyze">Analyze</Link></li>
        <li><Link className="text-blue-300 hover:text-sky-800" to="/about">About</Link></li>
        
      </ul>
    </nav>
  );
}

export default HomeNavbar;
