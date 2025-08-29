
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedFile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            fileName: {
                type: Type.STRING,
                description: 'The name of the file, e.g., "manifest.json".'
            },
            fileContent: {
                type: Type.STRING,
                description: 'The full string content of the file.'
            },
            language: {
                type: Type.STRING,
                description: 'The programming language of the file, e.g., "json", "html", "javascript".'
            },
        },
        required: ["fileName", "fileContent", "language"],
    },
};

export async function generateExtensionFiles(prompt: string): Promise<GeneratedFile[]> {
    const fullPrompt = `
You are an expert Chrome Extension developer. Based on the user's request, generate a complete set of files for a functional Chrome extension using Manifest V3.

Your response MUST be a valid JSON array of objects, where each object represents a file. Do not include any other text, markdown, or explanations outside of the JSON structure.

Each file object must have the following properties:
- "fileName": The name of the file (e.g., "manifest.json", "popup.js").
- "fileContent": A string containing the full code for the file.
- "language": The language of the code (e.g., "json", "html", "javascript").

Generate the following five files, even if their content is minimal or just comments for the requested functionality:
- manifest.json (must be Manifest V3)
- popup.html
- popup.js
- background.js
- content.js

User's extension idea: "${prompt}"
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text;
        if (!jsonText) {
            throw new Error("API returned an empty response.");
        }

        const parsedResponse = JSON.parse(jsonText);

        if (!Array.isArray(parsedResponse)) {
             throw new Error("API response is not a JSON array.");
        }

        // Validate the structure of the returned files
        const requiredFiles = ["manifest.json", "popup.html", "popup.js", "background.js", "content.js"];
        const receivedFiles = parsedResponse.map(f => f.fileName);

        if(!requiredFiles.every(rf => receivedFiles.includes(rf))) {
            console.warn("API did not return all required files. This may be okay depending on the request.");
        }

        return parsedResponse as GeneratedFile[];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate extension files. The AI model might be unavailable or the request could not be processed.");
    }
}
