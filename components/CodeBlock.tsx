import React, { useState, useEffect, useRef } from 'react';
import { CopyIcon } from './icons/CopyIcon';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && window.hljs) {
      window.hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 bg-slate-700/50 hover:bg-slate-600 rounded-md opacity-0 group-hover:opacity-100 transition-all text-slate-300 text-xs flex items-center gap-1.5 z-10"
        aria-label="Copy code to clipboard"
      >
        <CopyIcon className="w-4 h-4" />
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
      {/* The highlight.js theme (`atom-one-dark`) provides its own padding and background */}
      <pre className="overflow-x-auto text-sm font-mono">
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;