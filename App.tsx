import React, { useState, useCallback } from 'react';
import type { GeneratedFile } from './types';
import { generateExtensionFiles } from './services/geminiService';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import { GeminiIcon } from './components/icons/GeminiIcon';

function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your extension.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedFiles(null);

    try {
      const files = await generateExtensionFiles(prompt);
      setGeneratedFiles(files);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="min-h-screen text-slate-200 font-sans antialiased">
      <header className="border-b border-white/10 p-4 sticky top-0 bg-slate-900/50 backdrop-blur-md z-10">
        <div className="container mx-auto flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <GeminiIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Jukto
          </h1>
          <span className="text-sm text-slate-400 hidden md:block relative top-px">Powered by Gemini</span>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InputPanel
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            error={error}
          />
          <OutputPanel
            files={generatedFiles}
            isLoading={isLoading}
          />
        </div>
      </main>

       <footer className="text-center p-6 mt-8 text-slate-500 text-sm">
        <p>Generated code is provided as-is. Always review and test your extension before publishing.</p>
      </footer>
    </div>
  );
}

export default App;