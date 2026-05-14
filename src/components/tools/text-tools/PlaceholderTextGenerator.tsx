'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PlaceholderTextGenerator - Generate Lorem Ipsum and other placeholder text styles.
 */
export default function PlaceholderTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState<'lorem' | 'hipster' | 'corporate' | 'tech'>('lorem');
  const [count, setCount] = useState('3');
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const loremWords = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
  const hipsterWords = 'artisan craft sustainable organic vegan gluten-free kombucha avocado toast aesthetic minimalist curated bespoke handcrafted locally-sourced farm-to-table cold-pressed activated charcoal matcha oat-milk sourdough fermented probiotic mindful intentional ethical slow-living hygge wabi-sabi kinfolk vintage retro thrifted upcycled zero-waste plant-based whole-foods adaptogenic superfood'.split(' ');
  const corporateWords = 'synergy leverage paradigm stakeholder deliverable bandwidth scalable proactive innovative disruptive ecosystem pipeline roadmap alignment optimization streamline agile sprint velocity milestone KPI ROI engagement metrics analytics dashboard workflow automation integration platform solution enterprise strategy initiative transformation digital cloud-native microservices'.split(' ');
  const techWords = 'algorithm blockchain cryptocurrency decentralized API endpoint microservice container kubernetes docker serverless lambda function callback promise async await middleware pipeline CI/CD deployment infrastructure monitoring observability latency throughput scalability redundancy failover load-balancer cache distributed consensus protocol encryption authentication authorization token webhook'.split(' ');

  const getWords = (): string[] => {
    switch (style) {
      case 'hipster': return hipsterWords;
      case 'corporate': return corporateWords;
      case 'tech': return techWords;
      default: return loremWords;
    }
  };

  const randomWord = (words: string[]) => words[Math.floor(Math.random() * words.length)];

  const generateSentence = (words: string[]): string => {
    const len = 8 + Math.floor(Math.random() * 12);
    const sentence = Array.from({ length: len }, () => randomWord(words)).join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (words: string[]): string => {
    const sentenceCount = 4 + Math.floor(Math.random() * 4);
    return Array.from({ length: sentenceCount }, () => generateSentence(words)).join(' ');
  };

  const generate = () => {
    setError('');
    setResult('');
    const n = parseInt(count);
    if (isNaN(n) || n < 1 || n > 100) { setError('Enter a number between 1 and 100.'); return; }

    const words = getWords();

    if (unit === 'words') {
      const output = Array.from({ length: n }, () => randomWord(words)).join(' ');
      setResult(output.charAt(0).toUpperCase() + output.slice(1) + '.');
    } else if (unit === 'sentences') {
      setResult(Array.from({ length: n }, () => generateSentence(words)).join(' '));
    } else {
      setResult(Array.from({ length: n }, () => generateParagraph(words)).join('\n\n'));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex flex-wrap gap-2 mb-2">
        {(['lorem', 'hipster', 'corporate', 'tech'] as const).map((s) => (
          <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 rounded text-sm font-medium capitalize ${style === s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label={`${s} style`}>{s === 'lorem' ? 'Lorem Ipsum' : s}</button>
        ))}
      </div>

      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Count</label>
            <input id={`${toolId}-count`} type="text" inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value)} placeholder="e.g. 3" aria-label={`Count for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as 'paragraphs' | 'sentences' | 'words')} aria-label={`Unit for ${toolName}`} className="input-field">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate placeholder text">Generate</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <div className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto whitespace-pre-wrap">{result}</div>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
