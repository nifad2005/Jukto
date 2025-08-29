import React, { useState, useCallback } from 'react';
import type { GeneratedFile } from '../types';
import CodeBlock from './CodeBlock';
import { DownloadIcon } from './icons/DownloadIcon';
import { GeminiIcon } from './icons/GeminiIcon';

interface OutputPanelProps {
  files: GeneratedFile[] | null;
  isLoading: boolean;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ files, isLoading }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleDownloadAll = useCallback(() => {
    if (!files || !window.JSZip) return;

    const zip = new window.JSZip();
    files.forEach(file => {
      zip.file(file.fileName, file.fileContent);
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'jukto-extension.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });
  }, [files]);
  
  const orderedFiles = files?.sort((a,b) => {
    const order = ["manifest.json", "popup.html", "popup.js", "content.js", "background.js"];
    return order.indexOf(a.fileName) - order.indexOf(b.fileName);
  }) || [];

  if (isLoading) {
    return (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10 shadow-2xl shadow-slate-950/50 min-h-[440px] animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-8 bg-slate-700 rounded-md w-2/3"></div>
                <div className="h-8 bg-slate-700 rounded-md w-1/4"></div>
            </div>
            <div className="h-96 bg-slate-700/50 rounded-md"></div>
        </div>
    );
  }
  
  if (!files) {
    return (
        <div className="bg-slate-800/50 rounded-xl p-8 border border-dashed border-slate-700 shadow-inner min-h-[440px] flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-slate-900/50 rounded-full border border-slate-700">
                <GeminiIcon className="w-10 h-10 text-indigo-400"/>
            </div>
            <h3 className="text-xl font-semibold text-white mt-6 mb-2">Your extension files will appear here</h3>
            <p className="text-slate-400 max-w-sm">
                Describe your idea, click generate, and watch the AI build your browser extension.
            </p>
        </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/10 shadow-2xl shadow-slate-950/50 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center p-3 bg-slate-900/70 border-b border-white/10 gap-2">
            <div className="flex flex-wrap border-b-0 border-slate-700">
              {orderedFiles.map((file, index) => (
                <button
                  key={file.fileName}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 text-sm font-medium rounded-md mr-2 mb-1 transition-all duration-200 ${
                    activeTab === index
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {file.fileName}
                </button>
              ))}
            </div>
            <button 
                onClick={handleDownloadAll}
                className="flex items-center gap-2 bg-gradient-to-br from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 text-sm shadow-lg shadow-green-900/50 transform hover:scale-105 active:scale-100"
            >
                <DownloadIcon className="w-4 h-4" />
                Download .ZIP
            </button>
        </div>
      
      <div className="bg-[#0d1117]">
        {orderedFiles.length > 0 && (
          <CodeBlock
            key={orderedFiles[activeTab].fileName}
            language={orderedFiles[activeTab].language}
            code={orderedFiles[activeTab].fileContent}
          />
        )}
      </div>
    </div>
  );
};

export default OutputPanel;