/**
 * Main page: GitHub README Generator
 * Orchestrates Hero input and Preview components
 */

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import PreviewConsole from '@/components/PreviewConsole';

export default function Index() {
  const [readme, setReadme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provenance, setProvenance] = useState<Array<{ file: string; reason: string }>>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-800/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <HeroSection 
        onGenerate={() => {}} 
        isGenerating={isLoading}
        setIsGenerating={setIsLoading}
        setReadme={setReadme}
        setProvenance={setProvenance}
      />
      
      <PreviewConsole 
        isGenerating={isLoading}
        readme={readme}
        provenance={provenance}
      />
    </div>
  );
}
