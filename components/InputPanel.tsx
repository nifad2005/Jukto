import React from 'react';

interface InputPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

const InputPanel: React.FC<InputPanelProps> = ({ prompt, setPrompt, onGenerate, isLoading, error }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10 shadow-2xl shadow-slate-950/50 h-full flex flex-col">
      <label htmlFor="prompt" className="text-lg font-semibold text-slate-100 mb-2">
        Describe Your Extension
      </label>
      <p className="text-sm text-slate-400 mb-4">
        Be descriptive. For example: "Create an extension that changes the background color of any page to a random color when I click a button in the popup."
      </p>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., An extension to replace all images on a page with pictures of cats."
        className="flex-grow w-full p-3 bg-slate-900/70 border border-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 text-slate-200 resize-none min-h-[250px] placeholder:text-slate-500"
        disabled={isLoading}
        aria-label="Extension description prompt"
      />
      {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
      <button
        onClick={onGenerate}
        disabled={isLoading || !prompt.trim()}
        className="mt-6 w-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Extension'
        )}
      </button>
    </div>
  );
};

export default InputPanel;