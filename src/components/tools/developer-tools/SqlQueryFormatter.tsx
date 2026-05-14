'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SqlQueryFormatter - Format SQL queries with proper indentation and keyword capitalization.
 */
export default function SqlQueryFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');

  const formatSql = (sql: string): string => {
    if (!sql.trim()) return '';
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'UNION', 'UNION ALL', 'AS', 'IN', 'NOT', 'NULL', 'IS', 'BETWEEN', 'LIKE', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'];

    let formatted = sql.replace(/\s+/g, ' ').trim();

    // Capitalize keywords
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, kw);
    }

    // Add newlines before major clauses
    const newlineKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'];
    for (const kw of newlineKeywords) {
      const regex = new RegExp(`\\s+${kw}\\b`, 'g');
      formatted = formatted.replace(regex, `\n${kw}`);
    }

    // Indent sub-clauses
    const lines = formatted.split('\n');
    const indented = lines.map((line, i) => {
      const trimmed = line.trim();
      if (i === 0) return trimmed;
      if (/^(AND|OR|ON|SET)/.test(trimmed)) return '  ' + trimmed;
      return trimmed;
    });

    return indented.join('\n');
  };

  const result = formatSql(input);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">SQL Query</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} rows={6} placeholder="SELECT * FROM users WHERE id = 1 AND active = true" aria-label={`SQL input for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
