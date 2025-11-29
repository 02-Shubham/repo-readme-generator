import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import BackgroundEffects from '@/components/BackgroundEffects';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import PreviewConsole from '@/components/PreviewConsole';
import FeaturesGrid from '@/components/FeaturesGrid';

const LandingPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  // This function is passed down to the HeroSection
  const handleGenerate = (url) => {
    if(!url) return; 
    console.log("Generating for:", url);
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono selection:bg-white selection:text-black overflow-hidden flex flex-col">
      <BackgroundEffects />
      
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection onGenerate={handleGenerate} isGenerating={isGenerating} />
        <PreviewConsole isGenerating={isGenerating} />
        <FeaturesGrid />
      </main>

      {/* Simple Footer Component Inline (or extract it too) */}
      <footer className="border-t border-gray-800 py-12 bg-black relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-white text-black p-0.5">
                <Terminal size={14} strokeWidth={3} />
            </div>
            <span className="text-white font-bold text-sm">REPO_READER</span>
          </div>
          <div className="text-gray-600 text-xs font-mono">
            © 2024 BUILD_LABS. NO RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;