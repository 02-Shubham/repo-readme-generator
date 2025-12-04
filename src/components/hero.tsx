import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Preview from '@/components/Preview';
import { Terminal, Download,Github, FileText, Zap, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GenerateResponse {
  readme: string;
  provenance: Array<{ file: string; reason: string }>;
}

const LandingPage = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [readme, setReadme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provenance, setProvenance] = useState<Array<{ file: string; reason: string }>>([]);
  const { toast } = useToast();

const handleGenerate = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: 'INPUT_ERROR',
        description: 'Please enter a valid GitHub repository URL.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setReadme('');
    setProvenance([]);

    try {
      const { data, error } = await supabase.functions.invoke('generate-readme', {
        body: { repoUrl },
      });

      if (error) throw error;

      const response: GenerateResponse = data;
      setReadme(response.readme);
      setProvenance(response.provenance);

      toast({
        title: 'SUCCESS',
        description: 'README generated successfully.',
      });
    } catch (error: any) {
      console.error('Error generating README:', error);
      
      let errorMessage = 'Failed to generate README';
      if (error?.message) errorMessage = error.message;
      else if (error?.error) errorMessage = error.error;
      else if (typeof error === 'string') errorMessage = error;
      
      if (errorMessage.includes('rate limit')) {
        errorMessage += '\n\nGitHub limits unauthenticated requests. Try again later.';
      } else if (errorMessage.includes('forbidden') || errorMessage.includes('private')) {
        errorMessage += '\n\nRepository may be private or require auth.';
      }
      
      toast({
        title: 'EXECUTION_FAILED',
        description: errorMessage,
        variant: 'destructive',
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

const handleDownload = () => {
    if (!readme) return;
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'DOWNLOAD_COMPLETE',
      description: 'README.md saved to local disk.',
    });
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono selection:bg-white selection:text-black overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      
      {/* 1. Background Grid Texture */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" 
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
            Stop Writing README.<br />
            <span className="text-transparent mt-10 pt-10 bg-clip-text bg-gradient-to-r from-gray-400 to-white">
              Start Shipping Faster.
            </span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 mb-12">
            The AI-powered generator that scans your codebase architecture and compiles a polished, professional README.md instantly. No fluff. Just specs.
          </p>

          {/* INTERACTIVE DEMO INPUT */}
          <div className="max-w-xl mx-auto">
              <div className="relative flex bg-black border border-gray-700 p-2 items-center">
                  <div className="pl-3 pr-2 pointer-events-none text-gray-500 font-bold">$</div>
                  <input
                    type="text"
                    className="bg-transparent border-none text-white w-full focus:ring-0 placeholder-gray-700 outline-none h-10 font-mono"
                    placeholder="https://github.com/owner/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    disabled={isLoading}
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="ml-2 bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 px-6 py-2 font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    {isLoading ? (
                      <span className="animate-pulse">PROCESSING...</span>
                    ) : (
                      <>EXECUTE <ChevronRight size={14} /></>
                    )}
                  </button>
                </div>
            <p className="mt-3 text-xs text-gray-600 text-left pl-2">
              * Supports Public & Private Repos via Auth
            </p>
          </div>
        </div>

        {/* Preview Section - Wrapped in Rough Rectangle */}
        {readme && (
           <div className="max-w-5xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="border border-gray-700 bg-gray-900/50 p-2">
              <div className="border border-gray-800 bg-black relative">
                
                {/* Window Controls Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800 bg-gray-900/20">
                  <div className="flex gap-4">
                     <div className="w-3 h-3 bg-red-500 rounded-none hover:bg-red-400 transition-colors"></div>
                     <div className="w-3 h-3 bg-yellow-500 rounded-none hover:bg-yellow-400 transition-colors"></div>
                     <div className="w-3 h-3 bg-green-500 rounded-none hover:bg-green-400 transition-colors"></div>
                  </div>
                  <div className="text-xs text-gray-500 font-bold tracking-widest">PREVIEW.md</div>
                </div>

                {/* Actual Markdown Preview Component */}
                <div className="p-6 md:p-10 prose prose-invert prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-headings:font-mono prose-headings:tracking-tighter max-w-none">
                  <Preview markdown={readme} onDownload={handleDownload} />
                </div>

              </div>
            </div>
           </div>
        )}


        {/* FEATURES GRID - Using neutral-950 for slightly darker contrast against the glow */}
        <div id="features" className="border-t border-gray-800 bg-neutral-950 relative z-20">
          <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-px bg-gray-800 border border-gray-800">
              
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

        {/* HOW IT WORKS SECTION */}
        <div id="how-it-works" className="border-t border-gray-800 bg-black relative z-20">
          <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">HOW_IT_WORKS()</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Simple four-step process to transform your repository into professional documentation
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Step 1 */}
              <div className="border border-gray-800 bg-black p-6 hover:bg-neutral-900 transition-colors group">
                <div className="text-4xl font-black text-gray-700 mb-4 group-hover:text-white transition-colors">01</div>
                <div className="mb-4 text-white p-2 border border-gray-800 inline-block group-hover:border-white transition-colors w-12 h-12 flex items-center justify-center">
                  <Github size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Paste URL</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Enter any public GitHub repository URL. No authentication needed for public repos.
                </p>
              </div>

              {/* Step 2 */}
              <div className="border border-gray-800 bg-black p-6 hover:bg-neutral-900 transition-colors group">
                <div className="text-4xl font-black text-gray-700 mb-4 group-hover:text-white transition-colors">02</div>
                <div className="mb-4 text-white p-2 border border-gray-800 inline-block group-hover:border-white transition-colors w-12 h-12 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Analyze Code</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Our AI scans key files: package.json, requirements.txt, Dockerfile, and more.
                </p>
              </div>

              {/* Step 3 */}
              <div className="border border-gray-800 bg-black p-6 hover:bg-neutral-900 transition-colors group">
                <div className="text-4xl font-black text-gray-700 mb-4 group-hover:text-white transition-colors">03</div>
                <div className="mb-4 text-white p-2 border border-gray-800 group-hover:border-white transition-colors w-12 h-12 flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">AI Generation</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Powered by Gemini API, generates comprehensive, well-structured README.md instantly.
                </p>
              </div>

              {/* Step 4 */}
              <div className="border border-gray-800 bg-black p-6 hover:bg-neutral-900 transition-colors group">
                <div className="text-4xl font-black text-gray-700 mb-4 group-hover:text-white transition-colors">04</div>
                <div className="mb-4 text-white p-2 border border-gray-800  group-hover:border-white transition-colors w-12 h-12 flex items-center justify-center">
                  <Download size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Download & Use</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Preview in real-time, download README.md, or integrate directly into your project.
                </p>
              </div>

            </div>

            {/* Process Flow Visualization */}
            <div className="mt-16 border border-gray-800 bg-black p-8">
              <div className="text-center mb-8">
                <p className="text-gray-500 text-sm font-mono mb-4">EXECUTION_FLOW</p>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between text-center gap-4">
                <div className="flex-1">
                  <div className="border border-gray-700 rounded-lg p-4 mb-4 bg-neutral-950">
                    <p className="text-white font-bold text-sm">Repository</p>
                    <p className="text-gray-500 text-xs mt-2">GitHub URL</p>
                  </div>
                </div>
                <div className="text-gray-600 hidden md:block">→</div>
                <div className="flex-1">
                  <div className="border border-gray-700 rounded-lg p-4 mb-4 bg-neutral-950">
                    <p className="text-white font-bold text-sm">File Analysis</p>
                    <p className="text-gray-500 text-xs mt-2">Extract Context</p>
                  </div>
                </div>
                <div className="text-gray-600 hidden md:block">→</div>
                <div className="flex-1">
                  <div className="border border-gray-700 rounded-lg p-4 mb-4 bg-neutral-950">
                    <p className="text-white font-bold text-sm">LLM Processing</p>
                    <p className="text-gray-500 text-xs mt-2">Gemini API</p>
                  </div>
                </div>
                <div className="text-gray-600 hidden md:block">→</div>
                <div className="flex-1">
                  <div className="border border-gray-700 rounded-lg p-4 mb-4 bg-neutral-950">
                    <p className="text-white font-bold text-sm">README.md</p>
                    <p className="text-gray-500 text-xs mt-2">Download/Preview</p>
                  </div>
                </div>
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
              Build with ❤️ by <a href='02-Shubham.vercel.app'>Shubham</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;