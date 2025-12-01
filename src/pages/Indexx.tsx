import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Terminal, Github, ChevronRight, Download, FileCode, AlertCircle } from 'lucide-react';
import Preview from '@/components/Preview';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

interface GenerateResponse {
  readme: string;
  provenance: Array<{ file: string; reason: string }>;
}

export default function Indexx() {
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
    <div className="min-h-screen bg-black text-gray-300 font-mono selection:bg-white selection:text-black overflow-x-hidden relative">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      {/* Uplight Glow */}
      <div className="fixed bottom-0 left-0 right-0 h-[80vh] z-0 pointer-events-none bg-gradient-to-t from-gray-800/40 via-black/10 to-transparent"></div>
      <Navbar />
      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
           <div className="inline-flex items-center gap-2 border border-gray-800 bg-gray-900/50 px-3 py-1 text-xs text-gray-400 mb-4">
            <Terminal size={12} />
            <span>SYSTEM_ONLINE</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter flex items-center justify-center gap-4">
            README_GENERATOR
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Input repository target. Execute AI analysis. output polished documentation.
          </p>
        </div>

        {/* Input Console */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="border border-gray-700 bg-gray-900/50 p-2">
            <div className="bg-black border border-gray-800 p-6 md:p-8">
              
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <Github size={14} />
                Target Repository
              </div>

              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 to-gray-600 opacity-20 blur group-hover:opacity-40 transition duration-200"></div>
                
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
              </div>

              {/* Provenance / Logs Console */}
              {(isLoading || provenance.length > 0) && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                    <FileCode size={12} />
                    SYSTEM LOGS
                  </div>
                  <div className="font-mono text-xs md:text-sm space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                    
                    {isLoading && provenance.length === 0 && (
                      <div className="text-green-500 animate-pulse">
                         Establishing connection to Supabase functions...
                      </div>
                    )}

                    {provenance.map((item, index) => (
                      <div key={index} className="flex gap-2 text-gray-400">
                        <span className="text-green-500 font-bold">{'>'}</span>
                        <span className="text-gray-300">{item.file}</span>
                        <span className="text-gray-600 border-l border-gray-800 pl-2 ml-2 hidden sm:inline">
                          // {item.reason}
                        </span>
                      </div>
                    ))}
                    
                    {!isLoading && provenance.length > 0 && (
                      <div className="text-green-500 mt-2 font-bold">
                         PROCESS COMPLETED. OUTPUT GENERATED.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-xs font-bold text-white hover:text-gray-300 transition-colors"
                  >
                    <Download size={14} />
                    SAVE_FILE
                  </button>
                </div>

                {/* Actual Markdown Preview Component */}
                <div className="p-6 md:p-10 prose prose-invert prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-headings:font-mono prose-headings:tracking-tighter max-w-none">
                  <Preview markdown={readme} onDownload={handleDownload} />
                </div>

              </div>
            </div>
           </div>
        )}

      </div>
    </div>
  );
}