import React, { useState } from 'react';
import { Terminal, Github, FileText, Zap, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const [url, setUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono selection:bg-white selection:text-black overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      
      {/* 1. Background Grid Texture */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* 2. NEW: Bottom "Uplight" Glowing Effect */}
      {/* This creates the subtle fade from bottom to top */}
      <div className="fixed bottom-0 left-0 right-0 h-[80vh] z-0 pointer-events-none bg-gradient-to-t from-gray-800/70 via-black/10 to-transparent"></div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10">
        
        {/* NAVBAR */}
        <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <div className="bg-white text-black p-1">
                  <Terminal size={20} strokeWidth={3} />
                </div>
                <span className="text-white font-bold tracking-tighter text-xl">REPO_READER</span>
              </div>
              <div className="hidden md:flex gap-8 text-sm font-bold">
                <a href="#how-it-works" className="hover:text-white transition-colors">HOW_IT_WORKS</a>
                <a href="#features" className="hover:text-white transition-colors">FEATURES</a>
                <a href="https://github.com" className="hover:text-white transition-colors flex items-center gap-2">
                  <Github size={16} /> GITHUB
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
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

          {/* INTERACTIVE DEMO INPUT */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleGenerate} className="relative group">
              {/* Input Border Glow effect on hover */}
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
                />
                <button 
                  type="submit"
                  className="ml-2 bg-white text-black hover:bg-gray-200 px-6 py-3 font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap active:translate-y-0.5"
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

        {/* MOCKUP SECTION */}
        <div className="max-w-6xl mx-auto px-4 pb-24">
          <div className="border border-gray-700 bg-gray-900/50 p-2">
            <div className="border border-gray-800 bg-black p-6 md:p-10 relative overflow-hidden min-h-[400px]">
              
              {/* Decorative Header */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <div className="flex gap-4">
                   {/* Square window controls for brutalist look */}
                   <div className="w-3 h-3 bg-red-500 rounded-none"></div>
                   <div className="w-3 h-3 bg-yellow-500 rounded-none"></div>
                   <div className="w-3 h-3 bg-green-500 rounded-none"></div>
                </div>
                <div className="text-xs text-gray-500">PREVIEW.md</div>
              </div>
              
              {/* Content Mockup - Scanning Animation State */}
              <div className={`space-y-4 font-sans transition-opacity duration-500 ${isGenerating ? 'opacity-50' : 'opacity-80'}`}>
                {isGenerating ? (
                  <div className="font-mono text-green-500 flex flex-col gap-2">
                    <p className="animate-pulse"> Analyzing /src/components...</p>
                    <p className="animate-pulse delay-75"> Reading package.json dependencies...</p>
                    <p className="animate-pulse delay-150"> Identifying tech stack...</p>
                  </div>
                ) : (
                  <>
                    <div className="h-8 w-1/3 bg-gray-800/50"></div>
                    <div className="h-4 w-3/4 bg-gray-900/50"></div>
                    <div className="h-4 w-1/2 bg-gray-900/50"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 opacity-60">
                      <div className="border border-gray-800 p-4 h-32"></div>
                      <div className="border border-gray-800 p-4 h-32"></div>
                      <div className="border border-gray-800 p-4 h-32"></div>
                    </div>
                  </>
                )}
              </div>

              {/* Overlay Label */}
              <div className="absolute bottom-4 right-4 bg-white text-black text-xs font-bold px-2 py-1">
                {isGenerating ? 'PROCESSING...' : 'GENERATED OUTPUT'}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES GRID - Using neutral-950 for slightly darker contrast against the glow */}
        <div id="features" className="border-t border-gray-800 bg-neutral-950 relative z-20">
          <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800 border border-gray-800">
              
              {/* Feature 1 */}
              <div className="bg-black p-8 hover:bg-neutral-900 transition-colors group">
                <div className="mb-4 text-white p-2 border border-gray-800 inline-block group-hover:border-white transition-colors">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Context Aware</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  The AI understands dependency trees. It doesn't just read files; it understands how your modules interact.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-black p-8 hover:bg-neutral-900 transition-colors group">
                 <div className="mb-4 text-white p-2 border border-gray-800 inline-block group-hover:border-white transition-colors">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Instant Setup Guides</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Automatically generates "npm install" or "pip install" instructions based on your lock files.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-black p-8 hover:bg-neutral-900 transition-colors group">
                 <div className="mb-4 text-white p-2 border border-gray-800 inline-block group-hover:border-white transition-colors">
                  <Github size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Direct PR Integration</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Don't want to copy-paste? We can open a Pull Request directly to your repository with the new README.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-t border-gray-800 py-12 bg-black relative z-20">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-white text-black p-0.5">
                  <Terminal size={14} strokeWidth={3} />
              </div>
              <span className="text-white font-bold text-sm">REPO_READER</span>
            </div>
            <div className="text-gray-600 text-xs font-mono">
              Build with Love ❤️ by <a href='www.02-Shubham.vercel.app'>Shubham.</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;