'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ReadabilityResult {
  fleschKincaid: number;
  fleschEase: number;
  gunningFog: number;
  gradeLevel: string;
  words: number;
  sentences: number;
  syllables: number;
}

/**
 * TextReadabilityScorer - Calculates multiple readability formulas
 */
export default function TextReadabilityScorer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ReadabilityResult | null>(null);
  const [error, setError] = useState<string | undefined>();

  function countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  function analyze() {
    setError(undefined);
    setResult(null);

    if (!input.trim()) { setError('Please enter text to analyze'); return; }

    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = input.trim().split(/\s+/).filter(w => w.length > 0);

    if (words.length < 10) { setError('Please enter at least 10 words for accurate results'); return; }
    if (sentences.length < 1) { setError('Please enter at least one complete sentence'); return; }

    const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
    const complexWords = words.filter(w => countSyllables(w) >= 3).length;

    const numWords = words.length;
    const numSentences = sentences.length;

    // Flesch-Kincaid Grade Level
    const fkGrade = 0.39 * (numWords / numSentences) + 11.8 * (totalSyllables / numWords) - 15.59;

    // Flesch Reading Ease
    const fEase = 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (totalSyllables / numWords);

    // Gunning Fog Index
    const fog = 0.4 * ((numWords / numSentences) + 100 * (complexWords / numWords));

    let gradeLevel = '';
    if (fkGrade <= 5) gradeLevel = '5th grade or below';
    else if (fkGrade <= 8) gradeLevel = `${Math.round(fkGrade)}th grade`;
    else if (fkGrade <= 12) gradeLevel = `${Math.round(fkGrade)}th grade (High School)`;
    else gradeLevel = 'College level';

    setResult({
      fleschKincaid: fkGrade,
      fleschEase: fEase,
      gunningFog: fog,
      gradeLevel,
      words: numWords,
      sentences: numSentences,
      syllables: totalSyllables,
    });
  }

  const copyText = result ? `Flesch-Kincaid Grade: ${result.fleschKincaid.toFixed(1)}\nFlesch Reading Ease: ${result.fleschEase.toFixed(1)}\nGunning Fog Index: ${result.gunningFog.toFixed(1)}\nGrade Level: ${result.gradeLevel}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text Input (min 10 words)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your text here to calculate readability scores" aria-label={`Text input for ${toolName}`} className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
      </InputArea>

      <button onClick={analyze} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Analyze Readability</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.fleschKincaid.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Flesch-Kincaid Grade</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.fleschEase.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Flesch Reading Ease</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.gunningFog.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Gunning Fog Index</div>
              </div>
            </div>
            <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
              <p><strong>Grade Level:</strong> {result.gradeLevel}</p>
              <p className="mt-1 text-gray-500">Words: {result.words} | Sentences: {result.sentences} | Syllables: {result.syllables}</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
