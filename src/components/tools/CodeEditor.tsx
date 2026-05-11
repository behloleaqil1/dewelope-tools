'use client';

import { useRef, useCallback } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'json' | 'yaml' | 'xml' | 'sql' | 'plain';
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  height?: string;
  readOnly?: boolean;
}

/**
 * CodeEditor - A textarea with syntax-highlighted overlay for JSON, YAML, XML, and SQL.
 * Uses a layered approach: transparent textarea on top for editing, highlighted div behind for display.
 */
export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  ariaLabel,
  id,
  height = 'h-48',
  readOnly = false,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  function highlightCode(code: string, lang: string): string {
    if (!code) return '';

    let highlighted = escapeHtml(code);

    switch (lang) {
      case 'json':
        // Strings (keys and values)
        highlighted = highlighted.replace(
          /(&quot;)((?:[^&]|&(?!quot;))*)(&quot;)/g,
          (match, open, content, close) => {
            // Check if it's a key (followed by colon)
            const afterMatch = highlighted.indexOf(match) + match.length;
            const rest = highlighted.slice(afterMatch);
            if (rest.trimStart().startsWith(':')) {
              return `<span class="text-purple-700">${open}${content}${close}</span>`;
            }
            return `<span class="text-green-700">${open}${content}${close}</span>`;
          }
        );
        // Actually, let's use a simpler approach for JSON
        highlighted = escapeHtml(code);
        // Keys (before colon)
        highlighted = highlighted.replace(
          /^(\s*)(&quot;[^&]*&quot;)(\s*:)/gm,
          '$1<span class="text-purple-700 font-medium">$2</span>$3'
        );
        // String values (after colon)
        highlighted = highlighted.replace(
          /(:\s*)(&quot;[^&]*&quot;)/g,
          '$1<span class="text-green-700">$2</span>'
        );
        // Numbers
        highlighted = highlighted.replace(
          /:\s*(-?\d+\.?\d*)/g,
          ': <span class="text-blue-600">$1</span>'
        );
        // Booleans and null
        highlighted = highlighted.replace(
          /:\s*(true|false|null)/g,
          ': <span class="text-orange-600 font-medium">$1</span>'
        );
        // Braces and brackets
        highlighted = highlighted.replace(
          /([{}[\]])/g,
          '<span class="text-gray-500">$1</span>'
        );
        break;

      case 'yaml':
        // Comments
        highlighted = highlighted.replace(
          /(#.*$)/gm,
          '<span class="text-gray-400 italic">$1</span>'
        );
        // Keys (before colon)
        highlighted = highlighted.replace(
          /^(\s*)([\w.-]+)(\s*:)/gm,
          '$1<span class="text-purple-700 font-medium">$2</span>$3'
        );
        // String values in quotes
        highlighted = highlighted.replace(
          /(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g,
          '<span class="text-green-700">$1</span>'
        );
        // Booleans and null
        highlighted = highlighted.replace(
          /:\s*(true|false|null|~)\s*$/gm,
          ': <span class="text-orange-600 font-medium">$1</span>'
        );
        // Numbers
        highlighted = highlighted.replace(
          /:\s*(-?\d+\.?\d*)\s*$/gm,
          ': <span class="text-blue-600">$1</span>'
        );
        // Array dashes
        highlighted = highlighted.replace(
          /^(\s*)(- )/gm,
          '$1<span class="text-cyan-600 font-bold">$2</span>'
        );
        break;

      case 'xml':
        // Tags
        highlighted = highlighted.replace(
          /(&lt;\/?)([\w:-]+)/g,
          '$1<span class="text-red-700 font-medium">$2</span>'
        );
        // Attributes
        highlighted = highlighted.replace(
          /\s([\w:-]+)(=)/g,
          ' <span class="text-purple-600">$1</span>$2'
        );
        // Attribute values
        highlighted = highlighted.replace(
          /(=)(&quot;[^&]*&quot;)/g,
          '$1<span class="text-green-700">$2</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /(&lt;!--[\s\S]*?--&gt;)/g,
          '<span class="text-gray-400 italic">$1</span>'
        );
        break;

      case 'sql':
        // Keywords
        const sqlKeywords = /\b(SELECT|FROM|WHERE|AND|OR|JOIN|LEFT|RIGHT|INNER|OUTER|ON|ORDER BY|GROUP BY|HAVING|LIMIT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|AS|IN|NOT|NULL|IS|LIKE|BETWEEN|UNION|DISTINCT|COUNT|SUM|AVG|MAX|MIN|CASE|WHEN|THEN|ELSE|END|ASC|DESC)\b/gi;
        highlighted = highlighted.replace(
          sqlKeywords,
          '<span class="text-blue-700 font-bold uppercase">$1</span>'
        );
        // Strings
        highlighted = highlighted.replace(
          /(&#39;[^&]*&#39;)/g,
          '<span class="text-green-700">$1</span>'
        );
        // Numbers
        highlighted = highlighted.replace(
          /\b(\d+\.?\d*)\b/g,
          '<span class="text-orange-600">$1</span>'
        );
        break;

      default:
        break;
    }

    return highlighted;
  }

  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return (
    <div className={`relative ${height} rounded-lg border border-gray-300 overflow-hidden bg-gray-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}>
      {/* Syntax highlighted background */}
      <div
        ref={highlightRef}
        className={`absolute inset-0 p-3 overflow-auto pointer-events-none ${height}`}
        aria-hidden="true"
      >
        <pre
          className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{
            __html: value ? highlightCode(value, language) : `<span class="text-gray-500">${escapeHtml(placeholder || '')}</span>`,
          }}
        />
      </div>

      {/* Editable textarea (transparent text, visible caret) */}
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        placeholder=""
        aria-label={ariaLabel}
        readOnly={readOnly}
        spellCheck={false}
        className={`absolute inset-0 w-full ${height} p-3 text-sm font-mono leading-relaxed resize-none bg-transparent text-transparent caret-white outline-none whitespace-pre-wrap break-words`}
        style={{ caretColor: '#e5e7eb' }}
      />

      {/* Language badge */}
      <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded font-mono uppercase pointer-events-none">
        {language}
      </div>
    </div>
  );
}
