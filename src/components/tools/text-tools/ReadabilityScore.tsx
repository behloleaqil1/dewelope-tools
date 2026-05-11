'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ReadabilityScore - Calculates Flesch-Kincaid readability score and grade level.
 * Also provides Flesch Reading Ease score and interpretation.
 */
export default function ReadabilityScore({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    fleschEase: number;
    gradeLevel: number;
    words: number;
    sentences: number;
    syllables: number;
    interpretation: string;
  } | null>(null);

  const countSyllables = (word: string): number => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const getInterpretation = (score: number): string => {
    if (score >= 90) return 'Very Easy (5th grade)';
    if (score >= 80) return 'Easy (6th grade)';
    if (score >= 70) return 'Fairly Easy (7th grade)';
    if (score >= 60) return 'Standard (8th-9th grade)';
    if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
    if (score >= 30) return 'Difficult (College level)';
    return 'Very Difficult (College graduate)';
  };

  const calculate = () => {
    if (!input.trim()) return;

    const sentences = input.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = input.split(/\s+/).filter((w) => w.replace(/[^a-zA-Z]/g, '').length > 0);
    const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

    const wordCount = words.length;
    const sentenceCount = Math.max(sentences.length, 1);

    // Flesch Reading Ease
    const fleschEase = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount);
    // Flesch-Kincaid Grade Level
    const gradeLevel = 0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59;

    setResult({
      fleschEase: Math.round(fleschEase * 10) / 10,
      gradeLevel: Math.round(gradeLevel * 10) / 10,
      words: wordCount,
      sentences: sentenceCount,
      syllables: totalSyllables,
      interpretation: getInterpretation(fleschEase),
    });
  };

  const copyText = result
    ? `Flesch Reading Ease: ${result.fleschEase}\nFlesch-Kincaid Grade Level: ${result.gradeLevel}\nInterpretation: ${result.interpretation}\nWords: ${result.words}\nSentences: ${result.sentences}\nSyllables: ${result.syllables}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to analyze
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here to calculate readability scores..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate readability score" className="btn-primary">
        Calculate Readability
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.fleschEase}</div>
                <div className="text-xs text-gray-500 mt-1">Flesch Reading Ease</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.gradeLevel}</div>
                <div className="text-xs text-gray-500 mt-1">Grade Level</div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
              <div className="text-sm font-medium text-blue-800">{result.interpretation}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="font-bold text-gray-700">{result.words}</div>
                <div className="text-xs text-gray-500">Words</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="font-bold text-gray-700">{result.sentences}</div>
                <div className="text-xs text-gray-500">Sentences</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="font-bold text-gray-700">{result.syllables}</div>
                <div className="text-xs text-gray-500">Syllables</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
