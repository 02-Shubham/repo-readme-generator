import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const HeroSection = ({ onGenerate, isGenerating }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center relative z-10">
      <div className="inline-block border border-gray-700 bg-gray-900 px-3 py-1 text-xs mb-8 text-gray-400">
        v1.0.0 // NOW_LIVE
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
        YOUR CODE SPEAKS.<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">
          WE WRITE THE MANUAL.
        </span>
      </h1>
      
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 mb-12">
        The AI-powered generator that scans your codebase architecture and compiles a polished, professional README.md instantly. No fluff. Just specs.
      </p>

      {/* Input Form */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 to-gray-600 opacity-50 blur group-hover:opacity-75 transition duration-200"></div>
          <div className="relative flex bg-black border border-gray-700 p-2">
            <div className="flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 mr-2">$</span>
            </div>
            <input
              type="text"
              className="bg-transparent border-none text-white w-full focus:ring-0 placeholder-gray-600 outline-none"
              placeholder="Paste GitHub Repository URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isGenerating}
            />
            <button 
              type="submit"
              disabled={isGenerating}
              className="ml-2 bg-white text-black hover:bg-gray-200 disabled:bg-gray-500 px-6 py-3 font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap active:translate-y-0.5"
            >
              {isGenerating ? 'SCANNING...' : 'GENERATE_README'}
              {!isGenerating && <ChevronRight size={16} />}
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-gray-600 text-left pl-2">
          * Supports Public & Private Repos via Auth
        </p>
      </div>
    </div>
  );
};

export default HeroSection;