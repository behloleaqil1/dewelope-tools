'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToSlugAdvanced - Advanced slug generator with multiple styles.
 * Supports kebab-case, snake_case, camelCase, and PascalCase.
 */
export default function TextToSlugAdvanced({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<'kebab' | 'snake' | 'camel' | 'pascal'>('kebab');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const cleaned = input
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s-_]/g, '')
        .trim();

      const words = cleaned.split(/[\s\-_]+/).filter(Boolean).map(w => w.toLowerCase());

      if (words.length === 0) { setOutput(''); return; }

      let result: string;
      switch (style) {
        case 'kebab': result = words.join('-'); break;
        case 'snake': result = words.join('_'); break;
        case 'camel': result = words[0] + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''); break;
        case 'pascal': result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''); break;
        default: result = words.join('-');
      }
      setOutput(result);
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, style]);

  const styles: { value: typeof style; label: string; example: string }[] = [
    { value: 'kebab', label: 'kebab-case', example: 'my-page-title' },
    { value: 'snake', label: 'snake_case', example: 'my_page_title' },
    { value: 'camel', label: 'camelCase', example: 'myPageTitle' },
    { value: 'pascal', label: 'PascalCase', example: 'MyPageTitle' },
  ];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 flex-wrap">
        {styles.map((s) => (
          <button
            key={s.value}
            onClick={() => setStyle(s.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${style === s.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            aria-label={`Style: ${s.label}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to slug
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. My Blog Post Title!"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Slug</label>
            <p className="text-lg font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">{output}</p>
            <div className="text-xs text-gray-500">
              Style: {styles.find(s => s.value === style)?.label} • Length: {output.length} characters
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
