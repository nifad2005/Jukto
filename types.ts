import type JSZip from 'jszip';

// highlight.js type definition
interface HLJS {
  highlightElement(element: HTMLElement): void;
}

export interface GeneratedFile {
  fileName: string;
  fileContent: string;
  language: string;
}

declare global {
  interface Window {
    JSZip: typeof JSZip;
    hljs?: HLJS;
  }
}