import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PreviewConsole = ({ isGenerating, readme, provenance }) => {
  const { toast } = useToast();

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
      title: 'Downloaded',
      description: 'README.md saved to your downloads',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 relative z-10">
      <div className="border border-gray-700 bg-gray-900/50 p-2">
        <div className="border border-gray-800 bg-black p-6 md:p-10 relative overflow-hidden min-h-[400px]">
          
          {/* Decorative Header */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
            <div className="flex gap-4">
               <div className="w-3 h-3 bg-red-500 rounded-none"></div>
               <div className="w-3 h-3 bg-yellow-500 rounded-none"></div>
               <div className="w-3 h-3 bg-green-500 rounded-none"></div>
            </div>
            <div className="text-xs text-gray-500">README.md</div>
          </div>
          
          {/* Dynamic Content */}
          {isGenerating ? (
            <div className="font-mono text-green-500 flex flex-col gap-2 text-sm">
              <p className="animate-pulse">Cloning repository...</p>
              <p className="animate-pulse delay-75">Analyzing /src/components architecture...</p>
              <p className="animate-pulse delay-100">Parsing package.json dependencies...</p>
              <p className="animate-pulse delay-200">Generating documentation structure...</p>
            </div>
          ) : readme ? (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
              {/* Markdown Preview */}
              <div className="prose prose-invert max-w-none prose-sm">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mb-4 mt-0" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
                    p: ({ node, ...props }) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
                    code: ({ node, inline, ...props }) => 
                      inline ? 
                        <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm" {...props} /> :
                        <code className="block bg-gray-900 text-green-400 p-4 rounded my-4 overflow-x-auto text-sm" {...props} />,
                    pre: ({ node, ...props }) => <pre className="bg-gray-900 p-4 rounded overflow-x-auto mb-4" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                    li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                    a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4" {...props} />,
                  }}
                >
                  {readme}
                </ReactMarkdown>
              </div>

              {/* Provenance Info */}
              {provenance && provenance.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Files Analyzed:</h4>
                  <ul className="space-y-2">
                    {provenance.map((item, index) => (
                      <li key={index} className="text-xs text-gray-500">
                        <span className="text-green-500">•</span> <span className="text-gray-300 font-mono">{item.file}</span> — {item.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Download Button */}
              <div className="mt-8 flex gap-2 sticky bottom-0 bg-black/80 pt-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 font-bold text-sm transition-colors"
                >
                  <Download size={16} />
                  Download README.md
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 opacity-50">
              <div className="h-8 w-1/3 bg-gray-800/50"></div>
              <div className="h-4 w-3/4 bg-gray-900/50"></div>
              <div className="h-4 w-1/2 bg-gray-900/50"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="border border-gray-800 p-4 h-32"></div>
                <div className="border border-gray-800 p-4 h-32"></div>
                <div className="border border-gray-800 p-4 h-32"></div>
              </div>
            </div>
          )}

          {/* Status Label */}
          <div className="absolute bottom-4 right-4 bg-white text-black text-xs font-bold px-2 py-1">
            {isGenerating ? 'PROCESSING...' : readme ? 'GENERATED ✓' : 'READY'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewConsole;