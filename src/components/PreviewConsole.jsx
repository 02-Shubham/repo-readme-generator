import React from 'react';

const PreviewConsole = ({ isGenerating }) => {
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
            <div className="text-xs text-gray-500">PREVIEW.md</div>
          </div>
          
          {/* Dynamic Content */}
          <div className={`space-y-4 font-sans transition-opacity duration-500 ${isGenerating ? 'opacity-100' : 'opacity-80'}`}>
            {isGenerating ? (
              <div className="font-mono text-green-500 flex flex-col gap-2 text-sm">
                <p className="animate-pulse">Cloning repository...</p>
                <p className="animate-pulse delay-75">Analyzing /src/components architecture...</p>
                <p className="animate-pulse delay-100">Parsing package.json dependencies...</p>
                <p className="animate-pulse delay-200">Generating documentation structure...</p>
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

          {/* Status Label */}
          <div className="absolute bottom-4 right-4 bg-white text-black text-xs font-bold px-2 py-1">
            {isGenerating ? 'PROCESSING...' : 'GENERATED OUTPUT'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewConsole;