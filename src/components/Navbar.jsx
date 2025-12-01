import React from 'react';
import { Terminal, Github } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-40 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white text-black p-1">
              <Terminal size={20} strokeWidth={3} />
            </div>
            <span className="text-white font-bold tracking-tighter text-xl">REPO_READER</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">HOW_IT_WORKS</a>
            <a href="#features" className="hover:text-white transition-colors">FEATURES</a>
            <a href="https://github.com" className="hover:text-white transition-colors flex items-center gap-2">
              <Github size={16} /> GITHUB
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;