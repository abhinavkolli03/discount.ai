import React from 'react';
import { Link } from 'react-router-dom';

const HomeNavbar = () => {
  return (
    <nav className="bg-neutral-950 p-4 font-sans flex justify-between items-center">
      <div className="text-2xl font-bold text-sky-50">discount.ai</div>
      <ul className="flex space-x-4">
        <li><Link className="text-blue-300 hover:text-sky-800" to="/">Home</Link></li>
        <li><Link className="text-blue-300 hover:text-sky-800" to="/create">Create</Link></li>
        <li><Link className="text-blue-300 hover:text-sky-800" to="/analyze">Analyze</Link></li>
        <li><Link className="text-blue-300 hover:text-sky-800" to="/about">About</Link></li>
        <li>
          <Link className="bg-sky-50 text-neutral-950 px-4 py-2 rounded-full hover:bg-cyan-950 hover:text-blue-300" to="/signin">
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default HomeNavbar;
