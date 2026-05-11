'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SqlFormatter - Formats SQL queries with proper indentation and keyword capitalization.
 * Handles SELECT, FROM, WHERE, JOIN, ORDER BY, GROUP BY, and other common clauses.
 */
export default function SqlFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [uppercase, setUppercase] = useState(true);

  const KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'ORDER BY',
    'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES',
    'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE',
    'DROP TABLE', 'UNION', 'UNION ALL', 'AS', 'IN', 'NOT', 'NULL',
    'IS', 'LIKE', 'BETWEEN', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'DISTINCT', 'TOP', 'INTO', 'ASC', 'DESC',
  ];

  const NEWLINE_BEFORE = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON',
    'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET',
    'UNION', 'UNION ALL', 'SET', 'VALUES',
  ];

  function formatSql(sql: string): string {
    // Normalize whitespace
    let formatted = sql.replace(/\s+/g, ' ').trim();

    // Capitalize keywords
    for (const keyword of KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, uppercase ? keyword : keyword.toLowerCase());
    }

    // Add newlines before major clauses
    for (const keyword of NEWLINE_BEFORE) {
      const target = uppercase ? keyword : keyword.toLowerCase();
      const regex = new RegExp(`\\s+${target.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${target}`);
    }

    // Indent lines after SELECT, SET, VALUES
    const lines = formatted.split('\n');
    const result: string[] = [];
    let indentNext = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const upperTrimmed = trimmed.toUpperCase();

      if (indentNext && !NEWLINE_BEFORE.some(k => upperTrimmed.startsWith(k))) {
        result.push('  ' + trimmed);
      } else {
        result.push(trimmed);
        indentNext = false;
      }

      if (upperTrimmed.startsWith('SELECT') || upperTrimmed.startsWith('SET')) {
        indentNext = true;
      }
    }

    return result.join('\n');
  }

  function handleFormat() {
    setError(undefined);
    setOutput('');

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a SQL query to format');
      return;
    }

    try {
      const formatted = formatSql(trimmed);
      setOutput(formatted);
    } catch {
      setError('Failed to format SQL. Please check your input.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          SQL Query
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="select id, name, email from users where active = 1 and role = 'admin' order by name asc limit 10"
          aria-label={`SQL query input for ${toolName}`}
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <div className="flex items-center gap-4">
        <button onClick={handleFormat} aria-label="Format SQL query" className="btn-primary">
          Format SQL
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded border-gray-300"
          />
          Uppercase keywords
        </label>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Formatted SQL</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
